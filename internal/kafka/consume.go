package kafka

import (
	"fmt"
	"log"
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

	conn, err := c.DialLeader(args.Topic, args.Partition)
	if err != nil {
		log.Println(err)
		return err
	}

	_, err = seekRelativeOffset(conn, int64(args.Offset))
	if err != nil {
		log.Println(err)
		return err
	}

	for {
		select {
		case <-end:
			fmt.Printf("Received end signal. Closing consumer for topic %s\n", args.Topic)
			return nil

		default:
			conn.SetReadDeadline(time.Now().Add(1 * time.Second))
			fmt.Printf("Reading Batch\n")
			batch := conn.ReadBatch(1e3, 1e6)

			fmt.Println("Got batch", batch.Offset())

			for {
				msg, err := batch.ReadMessage()
				if err != nil {
					fmt.Println("Failed to read message", err)
					break
				}
				res <- msg
			}

			if err := batch.Close(); err != nil {
				fmt.Println("Failed to close batch:", err)
			}
		}
	}
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
