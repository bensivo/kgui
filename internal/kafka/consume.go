package kafka

import (
	"context"
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/segmentio/kafka-go"
	kgo "github.com/segmentio/kafka-go"
)

type ConsumeArgs struct {
	Topic     string
	Partition int
	Offset    int
}

// Consume messages from a single topic-partition pair, until a signal is received on the end channel.
//
// The res channel is not closed until the end signal is received.
func (c *Cluster) ConsumeF(args ConsumeArgs, res chan kgo.Message, end chan int) error {
	defer func() {
		fmt.Println("Closing consumer")
		close(res)
	}()

	offset, err := c.GetRelativeOffset(args.Topic, args.Partition, int64(args.Offset))
	if err != nil {
		fmt.Println("Could not get offset")
		return err
	}
	fmt.Printf("Relative offset: %d - Absolute offset: %d\n", args.Offset, offset)

	dialer, err := c.GetDialer()
	if err != nil {
		log.Fatal("Failed to get dialer", err)
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
		fmt.Println("Could not set offset")
		return err
	}

	var wg sync.WaitGroup
	wg.Add(1)
	cancelable, cancel := context.WithCancel(context.Background())
	go func() {
		for {
			m, err := r.ReadMessage(cancelable)
			if err != nil {
				fmt.Println(err)
				break
			}
			res <- m
		}

		fmt.Println("Finished reading message")
		if err := r.Close(); err != nil {
			log.Fatal("failed to close reader:", err)
		}

		wg.Done()
	}()

	go func() {
		for {
			select {
			case <-end:
				fmt.Printf("Received end signal. Closing consumer for topic %s\n", args.Topic)
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
func (c *Cluster) Consume(args ConsumeArgs, res chan kgo.Message) error {
	defer func() {
		fmt.Println("Closing consumer")
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
		fmt.Printf("No messages on partition %d\n", args.Partition)
		return err
	}

	currentOffset, err := seekRelativeOffset(conn, int64(args.Offset))
	if err != nil {
		log.Println(err)
		return err
	}
	fmt.Printf("Reading messages %d-%d\n", currentOffset, lastOffset)

	for {
		msg, err := conn.ReadMessage(10e6)
		if err != nil {
			fmt.Println("Failed to read message", err)
			break
		}

		res <- msg

		if msg.Offset == lastOffset-1 {
			fmt.Printf("Consumed all messages on partition %d\n", args.Partition)
			return nil
		}
	}
	return nil
}

func (c *Cluster) GetRelativeOffset(topic string, partition int, relativeOffset int64) (int64, error) {
	conn, err := c.DialLeader(topic, partition)
	defer func() {
		err = conn.Close()
		if err != nil {
			fmt.Println(err)
		}
	}()

	var seekPos int
	if relativeOffset >= 0 {
		seekPos = kafka.SeekStart
	} else {
		seekPos = kafka.SeekEnd
	}

	offset, err := conn.Seek(absInt(relativeOffset), seekPos)
	if err != nil {
		fmt.Println("Failed to seek offset", err)
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
		fmt.Println("Failed to seek offset", err)
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
