package kafka

import (
	"context"
	"log"
	"sync"
	"time"

	"github.com/segmentio/kafka-go"
	kgo "github.com/segmentio/kafka-go"
	"gitlab.com/bensivo/kgui/internal/logger"
)

type ConsumeArgs struct {
	Topic  string
	Offset int
}

func (c *Cluster) ConsumeAll(args ConsumeArgs, res chan kgo.Message) error {
	topics, err := c.GetTopics()
	if err != nil {
		return err
	}

	// Create a message channel for each partition, and merge them all into 1 output channel
	numPartitions := topics[args.Topic].NumPartitions
	partitionMessages := make([]chan kgo.Message, numPartitions)
	for i := 0; i < numPartitions; i++ {
		partitionMessages[i] = make(chan kgo.Message)
	}
	go fanInMessageChannels(res, partitionMessages...)

	logger.Infof("Topic %s has %d partitions. Starting consumers", args.Topic, numPartitions)
	for i := 0; i < numPartitions; i++ {
		go c.Consume(ConsumePartitionArgs{
			Topic:     args.Topic,
			Offset:    args.Offset,
			Partition: i,
		}, partitionMessages[i])
	}

	return nil
}

func (c *Cluster) ConsumeAllF(args ConsumeArgs, messages chan kgo.Message, end chan int) error {
	topics, err := c.GetTopics()
	if err != nil {
		return err
	}

	// Create a message channel for each partition, and merge them all into 1 output channel
	numPartitions := topics[args.Topic].NumPartitions
	partitionMessages := make([]chan kgo.Message, numPartitions)
	for i := 0; i < numPartitions; i++ {
		partitionMessages[i] = make(chan kgo.Message)
	}
	go fanInMessageChannels(messages, partitionMessages...)

	// Create a signal channel or each partition, and setup fanout
	partitionEnd := make([]chan int, numPartitions)
	for i := 0; i < numPartitions; i++ {
		partitionEnd[i] = make(chan int)
	}
	go fanOutSignalChannel(end, partitionEnd...)

	logger.Infof("Topic %s has %d partitions. Starting follow consumers", args.Topic, numPartitions)
	for i := 0; i < numPartitions; i++ {
		go c.ConsumeF(ConsumePartitionArgs{
			Topic:     args.Topic,
			Offset:    args.Offset,
			Partition: i,
		}, partitionMessages[i], partitionEnd[i])
	}

	return nil
}

func fanInMessageChannels(output chan kgo.Message, inputs ...chan kgo.Message) {
	var wg sync.WaitGroup
	wg.Add(len(inputs))
	for _, c := range inputs {
		go func(c chan kgo.Message) {
			for v := range c {
				output <- v
			}
			wg.Done()
		}(c)
	}

	wg.Wait()
	close(output)
}

func fanOutSignalChannel(input chan int, outputs ...chan int) {
	var wg sync.WaitGroup

	for v := range input {
		wg.Add(len(outputs))
		for _, output := range outputs {
			go func(o chan int, v int) {
				o <- v
				wg.Done()
			}(output, v)
		}
		wg.Wait()
	}
	logger.Info("fanout done")
}

type ConsumePartitionArgs struct {
	Topic     string
	Partition int
	Offset    int
}

// Consume messages from a single topic-partition pair, until a signal is received on the end channel.
//
// The res channel is not closed until the end signal is received.
func (c *Cluster) ConsumeF(args ConsumePartitionArgs, res chan<- kgo.Message, end chan int) error {
	defer func() {
		close(res)
	}()

	offset, err := c.GetRelativeOffset(args.Topic, args.Partition, int64(args.Offset))
	if err != nil {
		logger.Infoln("Could not get offset")
		return err
	}

	logger.Infof("Consuming messages %s(%d):%d-...", args.Topic, args.Partition, offset)

	dialer, err := c.GetDialer()
	if err != nil {
		logger.Infoln("Failed to get dialer", err)
		return err
	}
	r := kgo.NewReader(kafka.ReaderConfig{
		Brokers:   []string{c.BootstrapServer},
		Topic:     args.Topic,
		Partition: args.Partition,
		MinBytes:  0,
		MaxBytes:  1e6,
		Dialer:    dialer,
	})

	err = r.SetOffset(offset)
	if err != nil {
		logger.Infoln("Could not set offset")
		return err
	}

	var wg sync.WaitGroup
	wg.Add(1)
	cancelable, cancel := context.WithCancel(context.Background())
	go func() {
		for {
			m, err := r.ReadMessage(cancelable)
			if err != nil {
				logger.Infof("Stopping consumer %s(%d) - %v", args.Topic, args.Partition, err)
				// logger.Infoln(err)
				break
			}

			logger.Debugf("Consumed %s(%d):%d", args.Topic, args.Partition, m.Offset)
			res <- m
		}

		// We used to decrement the waitgroup AFTER the reader successfully closed,
		// but closing readers can take a long time, negatively affecting the UX.
		wg.Done()

		if err := r.Close(); err != nil {
			logger.Infoln("Failed to close reader", err)
		}
		logger.Infof("Closed reader %s(%d)", args.Topic, args.Partition)

	}()

	go func() {
		for {
			select {
			case <-end:
				logger.Infof("Consumer %s(%d) received end signal", args.Topic, args.Partition)
				cancel()
				return
			default:
				time.Sleep(1 * time.Second)
			}
		}
	}()

	wg.Wait()
	return nil
}

// Consume messages from a single topic-partition pair, until the end of the partition
//
// Unlike ConsumeF, this function self-terminates once the end of the partition is reached
func (c *Cluster) Consume(args ConsumePartitionArgs, res chan<- kgo.Message) error {
	logger.Infof("Consuming messages from %s(%d):%d (relative)", args.Topic, args.Partition, args.Offset)
	defer func() {
		logger.Infof("Closing consumer %s(%d)", args.Topic, args.Partition)
		close(res)
	}()

	conn, err := c.DialLeader(args.Topic, args.Partition)
	if err != nil {
		log.Println(err)
		return err
	}

	lastOffset, err := conn.ReadLastOffset()
	if err != nil {
		log.Println(err)
		return err
	}
	if lastOffset == 0 {
		logger.Infof("No messages on partition %d", args.Partition)
		return err
	}

	currentOffset, err := seekRelativeOffset(conn, int64(args.Offset))
	if err != nil {
		log.Println(err)
		return err
	}
	logger.Infof("Consuming messages %s(%d):%d-%d", args.Topic, args.Partition, currentOffset, lastOffset)

	for {
		msg, err := conn.ReadMessage(10e6)
		if err != nil {
			logger.Infoln("Failed to read message", err)
			break
		}

		logger.Debugf("Consumed %s(%d):%d", args.Topic, args.Partition, msg.Offset)
		res <- msg

		if msg.Offset == lastOffset-1 {
			logger.Infof("Consumed all messages on topic: %s, partition %d", args.Topic, args.Partition)
			return nil
		}
	}
	return nil
}

func (c *Cluster) GetRelativeOffset(topic string, partition int, relativeOffset int64) (int64, error) {
	conn, err := c.DialLeader(topic, partition)
	if err != nil {
		logger.Infoln(err)
		return -1, err
	}

	var seekPos int
	if relativeOffset >= 0 {
		seekPos = kafka.SeekStart
	} else {
		seekPos = kafka.SeekEnd
	}

	offset, err := conn.Seek(absInt(relativeOffset), seekPos)
	if err != nil {
		logger.Infoln("Failed to seek offset", err)
		return -1, err
	}

	err = conn.Close()
	if err != nil {
		logger.Infoln(err)
		return -1, err
	}

	return offset, nil
}

func seekRelativeOffset(conn *kgo.Conn, offset int64) (int64, error) {
	var seekPos int
	if offset >= 0 {
		seekPos = kafka.SeekStart
	} else {
		seekPos = kafka.SeekEnd
	}

	offset, err := conn.Seek(absInt(offset), seekPos)
	if err != nil {
		logger.Infoln("Failed to seek offset", err)
		return -1, err
	}

	return offset, nil
}

func absInt(n int64) int64 {
	if n < 0 {
		return -n
	} else {
		return n
	}
}
