package emitter

type Message struct {
	Topic string
	Data  interface{}
}

type MessageHandler func(data interface{})

type Emitter interface {
	Emit(topic string, data interface{})

	On(topic string, handler MessageHandler)

	Start()
}
