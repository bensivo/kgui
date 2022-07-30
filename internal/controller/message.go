package controller

import (
	"fmt"
	"log"

	"github.com/gorilla/websocket"
	"github.com/mitchellh/mapstructure"
	kgo "github.com/segmentio/kafka-go"
	"gitlab.com/bensivo/kgui/internal/kafka"
)

type MessageController struct {
	Conn *websocket.Conn
}

func (c *MessageController) Handle(msg Message) {
	switch msg.Topic {
	case "req.messages.produce":
		c.Produce(msg.Data)
	case "req.messages.consume":
		c.Consume(msg.Data)
	}
}

type ProducePayload struct {
	ClusterName string
	Topic       string
	Partition   int
	Message     string
}

func (c *MessageController) Produce(data interface{}) {
	var payload ProducePayload
	err := mapstructure.Decode(data, &payload)
	if err != nil {
		log.Fatal(err)
	}

	var cluster kafka.Cluster = state[payload.ClusterName]
	cluster.Produce(payload.Topic, payload.Partition, payload.Message)

	write(*c.Conn, "res.message.send", map[string]interface{}{
		"Status": "OK",
	})
}

type ConsumePayload struct {
	ClusterName string
	Topic       string
	Partition   int
	Offset      int
}

func (c *MessageController) Consume(data interface{}) {
	var payload ConsumePayload
	err := mapstructure.Decode(data, &payload)
	if err != nil {
		log.Fatal(err)
	}

	var cluster kafka.Cluster = state[payload.ClusterName]

	var args = kafka.ConsumeArgs{
		Topic:     payload.Topic,
		Partition: payload.Partition,
		Offset:    payload.Offset,
	}
	var results = make(chan kgo.Message)
	go cluster.Consume(args, results)

	go func() {
		for msg := range results {
			fmt.Println("Writing")
			write(*c.Conn, "res.messages.consume", map[string]interface{}{
				"ClusterName": payload.ClusterName,
				"Topic":       payload.Topic,
				"Partition":   payload.Partition,
				"Message":     msg,
			})
		}

		fmt.Println("Closing")
	}()
}
