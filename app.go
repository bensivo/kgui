package main

import (
	"context"
	"fmt"

	"github.com/wailsapp/wails/v2/pkg/runtime"
	"gitlab.com/bensivo/kgui/internal/controller"
	"gitlab.com/bensivo/kgui/internal/emitter"
	"gitlab.com/bensivo/kgui/internal/storage"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called at application startup
func (b *App) startup(ctx context.Context) {
	// Perform your setup here
	b.ctx = ctx

	emitter := emitter.NewWebsocketEmitter()
	clusterController := controller.NewClusterController(emitter)
	messageController := controller.NewMessageController(emitter)

	clusterController.RegisterHandlers()
	messageController.RegisterHandlers()

	emitter.Start()
}

// domReady is called after the front-end dom has been loaded
func (b *App) domReady(ctx context.Context) {
	// Add your action here
}

// shutdown is called at application termination
func (b *App) shutdown(ctx context.Context) {
	// Perform your teardown here
}

// Greet returns a greeting for the given name
func (b *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (b *App) Save(data map[string]interface{}) {
	storage.Save(b.ctx, data)
}

func (b *App) Open() (map[string]interface{}, error) {
	return storage.Open(b.ctx)
}

// Shows a Dialog
func (b *App) ShowDialog() {
	_, err := runtime.MessageDialog(b.ctx, runtime.MessageDialogOptions{
		Type:    runtime.InfoDialog,
		Title:   "Native Dialog from Go",
		Message: "This is a Native Dialog send from Go.",
	})

	if err != nil {
		panic(err)
	}
}
