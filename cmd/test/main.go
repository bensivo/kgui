package main

import (
	"fmt"
	"os"
	"path"
)

func main() {
	home, _ := os.UserHomeDir()
	filepath := path.Join(home, "project.kgui")

	fmt.Println(filepath)

	fmt.Println(path.Base(filepath))
	fmt.Println(path.Dir(filepath))
}
