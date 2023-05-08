package storage

import (
	"context"
	"encoding/json"
	"log"
	"os"
	"path"

	"github.com/wailsapp/wails/v2/pkg/runtime"
	"gitlab.com/bensivo/kgui/internal/logger"
)

var lastFilepath = ""

func Init() {
	home, err := os.UserHomeDir()
	if err != nil {
		log.Println(err)
		return
	}

	lastFilepath = path.Join(home, "project.kgui")
}

func Save(ctx context.Context, data map[string]interface{}) {
	file, err := runtime.SaveFileDialog(ctx, runtime.SaveDialogOptions{
		DefaultDirectory: path.Dir(lastFilepath),
		DefaultFilename:  path.Base(lastFilepath),
		Title:            "Save",
	})
	if err != nil {
		log.Println(err)
		return
	}

	logger.Info("Selected file: " + file)
	if file != "" {
		lastFilepath = file
	}

	bytes, err := json.Marshal(data)
	if err != nil {
		log.Println(err)
		return
	}

	err = os.WriteFile(file, bytes, 0600)
	if err != nil {
		log.Println(err)
		return
	}
}

func Open(ctx context.Context) (map[string]interface{}, error) {
	file, err := runtime.OpenFileDialog(ctx, runtime.OpenDialogOptions{
		DefaultDirectory: path.Dir(lastFilepath),
		DefaultFilename:  path.Base(lastFilepath),
		Title:            "Open",
	})
	if err != nil {
		log.Println(err)
		return nil, err
	}

	logger.Info("Selected file: " + file)
	if file != "" {
		lastFilepath = file
	}

	bytes, err := os.ReadFile(file)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	payload := make(map[string]interface{})
	err = json.Unmarshal(bytes, &payload)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	return payload, nil
}
