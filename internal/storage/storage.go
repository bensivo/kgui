package storage

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

func Save(ctx context.Context, data map[string]interface{}) {
	home, err := os.UserHomeDir()
	if err != nil {
		log.Println(err)
		return
	}

	file, err := runtime.SaveFileDialog(ctx, runtime.SaveDialogOptions{
		DefaultDirectory: home,
		DefaultFilename:  "project.kgui",
		Title:            "Save",
	})
	if err != nil {
		log.Println(err)
		return
	}

	fmt.Println("Selected file: " + file)
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
	home, err := os.UserHomeDir()
	if err != nil {
		log.Println(err)
		return nil, err
	}
	file, err := runtime.OpenFileDialog(ctx, runtime.OpenDialogOptions{
		DefaultDirectory: home,
		DefaultFilename:  "project.kgui",
		Title:            "Save",
	})
	if err != nil {
		log.Println(err)
		return nil, err
	}

	fmt.Println(file)
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
