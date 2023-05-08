package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/julienschmidt/httprouter"
	"gitlab.com/bensivo/kgui/internal/controller"
	"gitlab.com/bensivo/kgui/internal/emitter"
	"gitlab.com/bensivo/kgui/internal/logger"
	"gitlab.com/bensivo/kgui/internal/storage"
)

func main() {
	router := httprouter.New()
	router.GET("/app/*path", func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
		http.StripPrefix("/app", http.FileServer(http.Dir("frontend/dist/app"))).ServeHTTP(w, r)
	})

	logger.Init()
	storage.Init()
	emitter := emitter.NewWebsocketEmitter(router)
	messageController := controller.NewMessageController(emitter)

	messageController.RegisterHandlers()

	emitter.Start()

	err := http.ListenAndServe(":8080", router)
	if err != nil {
		log.Println(err)
		return
	}

	fmt.Scanf("v")
}
