package emitter

import (
	"context"

	"gitlab.com/bensivo/kgui/internal/logger"
	"go.uber.org/zap"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type EventsEmitter struct {
	ctx context.Context

	// handlers map[string][]MessageHandler

	log *zap.SugaredLogger
}

var _ Emitter = (*EventsEmitter)(nil) // Compiler check, *T implements I.

func NewEventsEmitter(ctx context.Context) *EventsEmitter {
	e := &EventsEmitter{
		ctx: ctx,
	}
	// e.handlers = make(map[string][]MessageHandler)

	logger.Infof("Creating new events Emitter")

	return e
}

func (e *EventsEmitter) Start() {}

func (e *EventsEmitter) Emit(topic string, payload interface{}) {
	runtime.EventsEmit(e.ctx, topic, payload)
}

func (e *EventsEmitter) On(topic string, handler MessageHandler) {
	logger.Info("Registering client for topic ", topic)
	// if e.handlers[topic] == nil {
	// 	e.handlers[topic] = make([]MessageHandler, 1)
	// }

	// e.handlers[topic] = append(e.handlers[topic], handler)

	runtime.EventsOn(e.ctx, topic, func(data ...interface{}) {
		handler(data[0])
	})
}
