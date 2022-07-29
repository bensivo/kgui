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
	conn := cluster.DialLeader(payload.Topic, payload.Partition)
	defer conn.Close()
	kafka.Produce(conn, payload.Message)

	write(*c.Conn, "res.message.send", map[string]interface{}{
		"Status": "OK",
	})
}
