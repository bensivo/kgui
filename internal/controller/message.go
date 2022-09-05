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
	case "message.produce":
		c.Produce(msg.Data)
	case "message.consume":
		c.Consume(msg.Data)
	}
}

type ProducePayload struct {
	CorrelationId string
	ClusterName   string
	Topic         string
	Partition     int
	Message       string
}

func (c *MessageController) Produce(data interface{}) {
	var payload ProducePayload
	err := mapstructure.Decode(data, &payload)
	if err != nil {
		log.Println(err)
	}

	var cluster kafka.Cluster = state[payload.ClusterName]
	err = cluster.Produce(payload.Topic, payload.Partition, payload.Message)

	if err != nil {
		Write(*c.Conn, "message.produced", map[string]interface{}{
			"CorrelationId": payload.CorrelationId,
			"Status":        "ERROR",
		})
	} else {
		Write(*c.Conn, "message.produced", map[string]interface{}{
			"CorrelationId": payload.CorrelationId,
			"Status":        "SUCCESS",
		})
	}

}

type ConsumePayload struct {
	ConsumerId  string
	ClusterName string
	Topic       string
	Partition   int
	Offset      int
}

func (c *MessageController) Consume(data interface{}) {
	var payload ConsumePayload
	err := mapstructure.Decode(data, &payload)
	if err != nil {
		log.Println(err)
	}

	var cluster kafka.Cluster = state[payload.ClusterName]

	var args = kafka.ConsumeArgs{
		Topic:     payload.Topic,
		Partition: payload.Partition,
		Offset:    payload.Offset,
	}
	var results = make(chan kgo.Message)
	go func() {
		err = cluster.Consume(args, results)
		if err != nil {
			log.Println(err)
		}
	}()

	go func() {
		fmt.Printf("Starting stream on Topic: %s\n", payload.Topic)
		for msg := range results {
			Write(*c.Conn, "message.consumed", map[string]interface{}{
				"ConsumerId":  payload.ConsumerId,
				"ClusterName": payload.ClusterName,
				"Topic":       payload.Topic,
				"Partition":   payload.Partition,
				"Message":     msg,
				"EOS":         false,
			})
		}

		Write(*c.Conn, "message.consumed", map[string]interface{}{
			"ConsumerId":  payload.ConsumerId,
			"ClusterName": payload.ClusterName,
			"Topic":       payload.Topic,
			"Partition":   payload.Partition,
			"EOS":         true,
		})

		fmt.Printf("Closing stream on Topic: %s\b", payload.Topic)
	}()
}
