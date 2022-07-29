package kafka

import (
	"log"
	"os"

	kgo "github.com/segmentio/kafka-go"
)

func (c *Cluster) Produce(topic string, partition int, message string) {
	conn := c.DialLeader(topic, partition)
	defer conn.Close()

	var bytes []byte = []byte(message)
	_, err := conn.WriteMessages(
		kgo.Message{Value: bytes},
	)
	if err != nil {
		log.Println("Failed to write messages", err)
		os.Exit(1)
	}
}
