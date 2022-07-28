package main

import (
	"fmt"
	"log"
	"net/http"

	"gitlab.com/bensivo/kgui/internal/server"
)

func main() {
	router := server.New()

	err := http.ListenAndServe(":8080", router)
	if err != nil {
		log.Fatal(err)
		return
	}
	fmt.Scanf("v")
}
