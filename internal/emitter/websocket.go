package emitter

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"github.com/gorilla/websocket"
	"github.com/julienschmidt/httprouter"
	"go.uber.org/zap"

	"gitlab.com/bensivo/kgui/internal/logger"
)

type WebsocketEmitter struct {
	connections []*websocket.Conn
	handlers    map[string][]MessageHandler
	router      *httprouter.Router

	log *zap.SugaredLogger
}

var _ Emitter = (*WebsocketEmitter)(nil) // Compiler check, *T implements I.

func NewWebsocketEmitter(router *httprouter.Router) *WebsocketEmitter {
	w := &WebsocketEmitter{
		router: router,
	}
	w.connections = make([]*websocket.Conn, 0)
	w.handlers = make(map[string][]MessageHandler)

	logger.Infof("Creating new websocket Emitter")

	return w
}

func (w *WebsocketEmitter) Start() {
	logger.Info("Starting websocket emitter")

	upgrader := websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}

	w.router.GET("/connect", func(writer http.ResponseWriter, req *http.Request, ps httprouter.Params) {
		logger.Info("Client connecting")
		conn, err := upgrader.Upgrade(writer, req, nil)
		if err != nil {
			log.Println(err)
			return
		}

		logger.Infof("Connection established %s", conn.RemoteAddr().String())
		w.connections = append(w.connections, conn)

		conn.SetCloseHandler(func(code int, text string) error {
			logger.Infof("Connection %s closed with code: %d", conn.RemoteAddr().String(), code)

			for i := 0; i < len(w.connections); i++ {
				if w.connections[i] == conn {
					w.connections[i] = w.connections[len(w.connections)-1]
					w.connections = w.connections[:len(w.connections)-1]
					break
				}
			}

			return nil
		})

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

			logger.Debugf("Message: %v", msg)

			handlers := w.handlers[msg.Topic]
			for i := 1; i < len(handlers); i++ {
				handlers[i](msg.Data)
			}
		}
	})
}

func (w *WebsocketEmitter) Emit(topic string, data interface{}) {
	msg := Message{
		Topic: topic,
		Data:  data,
	}

	resBytes, err := json.Marshal(msg)
	if err != nil {
		logger.Error(err)
	}

	for i := 0; i < len(w.connections); i++ {
		conn := w.connections[i]
		logger.Debugf("Writing to connection %s - %s", conn.LocalAddr().String(), resBytes)

		err = conn.WriteMessage(1, resBytes)
		if err != nil {
			logger.Error(err)
			return
		}
	}
}

func (w *WebsocketEmitter) On(topic string, handler MessageHandler) {
	logger.Info("Registering client for topic ", topic)
	if w.handlers[topic] == nil {
		w.handlers[topic] = make([]MessageHandler, 1)
	}

	w.handlers[topic] = append(w.handlers[topic], handler)
}
