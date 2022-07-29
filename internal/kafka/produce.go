package kafka

import (
	"log"
	"os"

	kgo "github.com/segmentio/kafka-go"
)

func Produce(conn *kgo.Conn, message string) {
	var bytes []byte = []byte(message)
	_, err := conn.WriteMessages(
		kgo.Message{Value: bytes},
	)
	if err != nil {
		log.Println("Failed to write messages", err)
		os.Exit(1)
	}
}
