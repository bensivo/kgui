package controller

import (
	"log"

	"github.com/gorilla/websocket"
	"github.com/mitchellh/mapstructure"
	"gitlab.com/bensivo/kgui/internal/kafka"
)

type MessageController struct {
	Conn *websocket.Conn
}

func (c *MessageController) Handle(msg Message) {
	switch msg.Topic {
	case "req.messages.send":
		c.Send(msg.Data)
	case "req.messages.read":
		c.Read(msg.Data)
	}
}

type SendMessagePayload struct {
	ClusterName string
	Topic       string
	Partition   int
	Message     string
}

func (c *MessageController) Send(data interface{}) {
	var payload SendMessagePayload
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

type ReadMessagePayload struct {
	ClusterName string
	Topic       string
	Partition   int
	Offset      int
}

func (c *MessageController) Read(data interface{}) {
	var payload ReadMessagePayload
	err := mapstructure.Decode(data, &payload)
	if err != nil {
		log.Fatal(err)
	}

	var cluster kafka.Cluster = state[payload.ClusterName]
	cluster.Consume(payload.Topic, payload.Partition, payload.Offset)

	// write(*c.Conn, "res.message.send", map[string]interface{}{
	// 	"Status": "OK",
	// })
}
