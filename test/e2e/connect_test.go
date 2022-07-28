package server

import (
	"log"

	"testing"

	"github.com/gorilla/websocket"
)

/**
 * Makes a connection, writes a message, and closes the connection
 */
func Test_Connect(t *testing.T) {

	conn, _, err := websocket.DefaultDialer.Dial("ws://localhost:8080/connect", nil)
	if err != nil {
		t.Error("Could not dial", err)
	}
	defer conn.Close()

	err = conn.WriteMessage(websocket.TextMessage, []byte("{\"Key\":\"String\"}"))
	if err != nil {
		t.Error("Could not write", err)
	}

	err = conn.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseNormalClosure, ""))
	if err != nil {
		log.Fatal("close:", err)
		t.Error("Could not close", err)
	}
}
