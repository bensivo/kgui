package controller

import (
	"encoding/json"
	"log"

	"github.com/gorilla/websocket"
)

type Controller interface {
	Handle(topic string, data interface{})
}

type Message struct {
	Topic string
	Data  interface{}
}

func Write(conn websocket.Conn, topic string, data interface{}) {
	msg := Message{
		Topic: topic,
		Data:  data,
	}
	resBytes, err := json.Marshal(msg)
	if err != nil {
		log.Fatal(err)
	}

	err = conn.WriteMessage(1, resBytes)
	if err != nil {
		log.Println(err)
		return
	}
}
