package kafka

import (
	"log"

	kgo "github.com/segmentio/kafka-go"
)

func (c *Cluster) Produce(topic string, partition int, message string) error {
	conn, err := c.DialLeader(topic, partition)
	if err != nil {
		log.Println(err)
		return err
	}

	defer conn.Close()

	var bytes []byte = []byte(message)
	_, err = conn.WriteMessages(
		kgo.Message{Value: bytes},
	)
	if err != nil {
		log.Println("Failed to write messages", err)
		return err
	}

	return nil
}
