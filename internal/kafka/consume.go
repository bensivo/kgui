package kafka

import (
	"fmt"
	"log"

	"github.com/segmentio/kafka-go"
	kgo "github.com/segmentio/kafka-go"
)

type ConsumeArgs struct {
	Topic     string
	Partition int
	Offset    int
}

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

		// fmt.Printf("%d - %s\n", msg.Offset, string(msg.Value))
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

	offset, err := conn.Seek(AbsInt(offset), seekPos)
	if err != nil {
		fmt.Println("Failed to seek offset", err)
		return -1, err
	}

	return offset, nil
}

func AbsInt(n int64) int64 {
	if n < 0 {
		return -n
	} else {
		return n
	}
}
