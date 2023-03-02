package emitter

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/gorilla/websocket"
	"github.com/julienschmidt/httprouter"
	"go.uber.org/zap"
)

type WebsocketEmitter struct {
	connections []*websocket.Conn
	handlers    map[string][]MessageHandler

	logger *zap.SugaredLogger
}

var _ Emitter = (*WebsocketEmitter)(nil) // Compiler check, *T implements I.

func NewWebsocketEmitter() *WebsocketEmitter {
	logger, _ := zap.NewDevelopment()
	defer logger.Sync() // flushes buffer, if any
	sugar := logger.Sugar()

	wi := &WebsocketEmitter{}
	wi.connections = make([]*websocket.Conn, 0)
	wi.handlers = make(map[string][]MessageHandler)
	wi.logger = sugar

	sugar.Info("Creating new WebsocketEmitter")

	return wi
}

func (wi *WebsocketEmitter) Start() {
	wi.logger.Info("Starting websocket emitter")
	router := httprouter.New()
	upgrader := websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}

	router.GET("/connect", func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
		wi.logger.Info("Client connecting")
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println(err)
			return
		}

		// TODO: Remove connection when the client disconnects
		wi.logger.Info("Client connected " + conn.LocalAddr().String())
		wi.connections = append(wi.connections, conn)

		for {
			_, p, err := conn.ReadMessage()
			if err != nil {
				log.Println(err)
				conn.Close()
				return
			}

			var msg Message
			dec := json.NewDecoder(strings.NewReader(string(p)))
			dec.Decode(&msg)

			log.Printf("Message: %v\n", msg)

			handlers := wi.handlers[msg.Topic]
			for i := 1; i < len(handlers); i++ {
				handlers[i](msg.Data)
			}
		}
	})

	err := http.ListenAndServe(":8080", router)
	if err != nil {
		log.Println(err)
		return
	}
}

func (wi *WebsocketEmitter) Emit(topic string, data interface{}) {
	msg := Message{
		Topic: topic,
		Data:  data,
	}

	resBytes, err := json.Marshal(msg)
	if err != nil {
		wi.logger.Error(err)
	}

	// TODO: Don't send anything to closed connections
	// our previous setup created a new set of controllers for each connection - so if the connection stopped sending messages, the controller was never triggered
	// In this new setup, there is 1 controller for N connections, and the controllers don't know which connectiosn are still active
	for i := 0; i < len(wi.connections); i++ {
		conn := wi.connections[i]
		fmt.Printf("Writing to connection %s - %s\n", conn.LocalAddr().String(), resBytes)

		err = conn.WriteMessage(1, resBytes)
		if err != nil {
			wi.logger.Error(err)
			return
		}
	}
}

func (wi *WebsocketEmitter) On(topic string, handler MessageHandler) {
	wi.logger.Info("Registering client for topic ", topic)
	if wi.handlers[topic] == nil {
		wi.handlers[topic] = make([]MessageHandler, 1)
	}

	wi.handlers[topic] = append(wi.handlers[topic], handler)
}
