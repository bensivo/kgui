package main

import (
	"embed"
	"runtime"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/logger"
	"github.com/wailsapp/wails/v2/pkg/menu"
	"github.com/wailsapp/wails/v2/pkg/menu/keys"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/windows"

	log "gitlab.com/bensivo/kgui/internal/logger"
)

//go:embed frontend/dist/app
var assets embed.FS

func main() {
	app := NewApp()
	appMenu := menu.NewMenu()
	fileMenu := appMenu.AddSubmenu("File")
	fileMenu.AddText("Open File", keys.CmdOrCtrl("o"), func(data *menu.CallbackData) {
		payload, err := app.Open()
		if err != nil {
			log.Error(err)
			return
		}
		app.emitter.Emit("load.data", payload)
	})
	fileMenu.AddText("Save File", keys.CmdOrCtrl("s"), func(data *menu.CallbackData) {
		payload := map[string]interface{}{}
		app.emitter.Emit("save.requested", payload)
	})
	fileMenu.AddSeparator()

	if runtime.GOOS == "darwin" {
		appMenu.Append(menu.EditMenu()) // on macos platform, we should append EditMenu to enable Cmd+C,Cmd+V,Cmd+Z... shortcut
	}

	// Create application with options
	err := wails.Run(&options.App{
		Title: "kgui",
		// Width: 720,
		// Height:            570,
		DisableResize:     false,
		Fullscreen:        false,
		Frameless:         false,
		StartHidden:       false,
		HideWindowOnClose: false,
		BackgroundColour:  &options.RGBA{R: 255, G: 255, B: 255, A: 255},
		Assets:            assets,
		LogLevel:          logger.DEBUG,
		OnStartup:         app.startup,
		OnDomReady:        app.domReady,
		OnShutdown:        app.shutdown,
		Menu:              appMenu,
		Bind: []interface{}{
			app,
		},
		// Windows platform specific options
		Windows: &windows.Options{
			WebviewIsTransparent: false,
			WindowIsTranslucent:  false,
			DisableWindowIcon:    false,
		},
	})

	if err != nil {
		log.Error(err)
	}
}
