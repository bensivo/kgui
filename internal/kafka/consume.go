package kafka

import (
	"fmt"
	"log"

	"github.com/segmentio/kafka-go"
)

func (c *Cluster) Consume(topic string, partition int, offset int) {
	conn := c.DialLeader(topic, partition)
	var err error

	var seekPos int
	if offset > 0 {
		seekPos = kafka.SeekStart
	} else {
		seekPos = kafka.SeekEnd
	}

	fmt.Printf("Seeking position %d\n", offset)
	_, err = conn.Seek(AbsInt(int64(offset)), seekPos)
	if err != nil {
		fmt.Println("Failed to seek offset", err)
		return
	}

	last, err := conn.ReadLastOffset()
	if err != nil {
		log.Fatal(err)
		return
	}

	fmt.Printf("Found offset %d\n", last)
	if last == 0 {
		fmt.Printf("No messages on partition %d\n", partition)
		return
	}

	// Read messages
	for {
		msg, err := conn.ReadMessage(10e6)
		if err != nil {
			fmt.Println("Failed to read message", err)
			break
		}

		fmt.Printf("Consumed message p(%d):%d - %s\n", partition, msg.Offset, string(msg.Value))
		// result <- string(msg.Value)

		if msg.Offset == last-1 {
			fmt.Printf("Consumed all messages on partition %d\n", partition)
			return
		}
	}
}

func AbsInt(n int64) int64 {
	if n < 0 {
		return -n
	} else {
		return n
	}
}
