package main

import (
	"embed"
	"log"
	"runtime"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/logger"
	"github.com/wailsapp/wails/v2/pkg/menu"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

//go:embed frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := NewApp()

	// TODO: Get save/load workign again after switching to emitters.
	// Need to store the emitter on the app object

	appMenu := menu.NewMenu()
	// fileMenu := appMenu.AddSubmenu("File")
	// fileMenu.AddText("Open File", keys.CmdOrCtrl("o"), func(data *menu.CallbackData) {

	// 	// TODO: we could do this without a call to app.Open() if we saved the app context variable somewhere
	// 	payload, err := app.Open()
	// 	if err != nil {
	// 		log.Println(err)
	// 		return
	// 	}

	// 	conns := server.GetConnections()
	// 	for _, conn := range conns {
	// 		controller.Write(*conn, "load.requested", payload)
	// 	}
	// })
	// fileMenu.AddText("Save File", keys.CmdOrCtrl("s"), func(data *menu.CallbackData) {
	// 	conns := server.GetConnections()
	// 	payload := map[string]interface{}{}
	// 	for _, conn := range conns {
	// 		controller.Write(*conn, "save.requested", payload)
	// 	}
	// })
	// fileMenu.AddSeparator()

	if runtime.GOOS == "darwin" {
		appMenu.Append(menu.EditMenu()) // on macos platform, we should append EditMenu to enable Cmd+C,Cmd+V,Cmd+Z... shortcut
	}

	// Create application with options
	err := wails.Run(&options.App{
		Title: "kgui",
		// Width:             720,
		// Height:            570,
		DisableResize:     false,
		Fullscreen:        false,
		Frameless:         false,
		StartHidden:       false,
		HideWindowOnClose: false,
		RGBA:              &options.RGBA{R: 255, G: 255, B: 255, A: 255},
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
		log.Println(err)
	}
}
