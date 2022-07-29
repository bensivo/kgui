package server

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"github.com/gorilla/websocket"
	"github.com/julienschmidt/httprouter"
	"gitlab.com/bensivo/kgui/internal/controller"
)

func New() *httprouter.Router {
	router := httprouter.New()
	upgrader := websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}

	router.GET("/connect", func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println(err)
			return
		}
		log.Println("Client connected " + conn.LocalAddr().String())

		var stateController = &controller.ClusterController{
			Conn: conn,
		}

		for {
			_, p, err := conn.ReadMessage()
			if err != nil {
				log.Println(err)
				conn.Close()
				return
			}

			var msg controller.Message
			dec := json.NewDecoder(strings.NewReader(string(p)))
			dec.Decode(&msg)

			log.Printf("Message: %v\n", msg)

			stateController.Handle(msg)

		}
	})

	return router
}
