package main

import (
	"fmt"

	"gitlab.com/bensivo/kgui/internal/controller"
	"gitlab.com/bensivo/kgui/internal/emitter"
)

func main() {
	emitter := emitter.NewWebsocketEmitter()
	clusterController := controller.NewClusterController(emitter)
	messageController := controller.NewMessageController(emitter)

	clusterController.RegisterHandlers()
	messageController.RegisterHandlers()

	emitter.Start()
	fmt.Scanf("v")
}
