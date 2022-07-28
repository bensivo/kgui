package controller

type Controller interface {
	Handle(event string, payload interface{})
}
