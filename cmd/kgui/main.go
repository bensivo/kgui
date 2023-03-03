package main

import (
	"fmt"

	"gitlab.com/bensivo/kgui/internal/controller"
	"gitlab.com/bensivo/kgui/internal/emitter"
	"gitlab.com/bensivo/kgui/internal/logger"
)

func main() {
	logger.Init()
	emitter := emitter.NewWebsocketEmitter()
	clusterController := controller.NewClusterController(emitter)
	messageController := controller.NewMessageController(emitter)

	clusterController.RegisterHandlers()
	messageController.RegisterHandlers()

	emitter.Start()
	fmt.Scanf("v")
}
