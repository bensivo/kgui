package controller

import (
	"encoding/json"
	"log"

	"github.com/gorilla/websocket"
)

type StateController struct {
	Conn *websocket.Conn
}

func (sc *StateController) Handle(payload map[string]interface{}) {
	switch payload["Event"] {
	case "state.read":
		sc.readState()
	}
}

func (sc *StateController) readState() {
	log.Println("State.read")
	res := make(map[string]interface{})
	res["key"] = "value"
	write(*sc.Conn, res)
}

func write(conn websocket.Conn, data interface{}) {
	resBytes, err := json.Marshal(data)
	if err != nil {
		log.Fatal(err)
	}

	err = conn.WriteMessage(1, resBytes)
	if err != nil {
		log.Println(err)
		return
	}
}
