package controller

import (
	"log"

	"github.com/mitchellh/mapstructure"
	"gitlab.com/bensivo/kgui/internal/emitter"
	"gitlab.com/bensivo/kgui/internal/kafka"
	"gitlab.com/bensivo/kgui/internal/logger"

	kgo "github.com/segmentio/kafka-go"
)

type MessageController struct {
	Emitter emitter.Emitter
}

func NewMessageController(e emitter.Emitter) *MessageController {
	c := &MessageController{
		Emitter: e,
	}

	return c
}

func (c *MessageController) RegisterHandlers() {
	c.Emitter.On("message.produce", c.Produce)
	c.Emitter.On("message.consume", c.Consume)
	c.Emitter.On("message.stop", c.Stop)
}

type ProducePayload struct {
	CorrelationId string
	ClusterName   string
	Topic         string
	Partition     int
	Message       string
}

func (c *MessageController) Produce(data interface{}) {
	var payload ProducePayload
	err := mapstructure.Decode(data, &payload)
	if err != nil {
		logger.Error(err)
	}

	var cluster kafka.Cluster = state[payload.ClusterName]
	err = cluster.Produce(payload.Topic, payload.Partition, payload.Message)

	if err != nil {
		c.Emitter.Emit("message.produced", map[string]interface{}{
			"CorrelationId": payload.CorrelationId,
			"Status":        "ERROR",
		})
		c.Emitter.Emit("error", map[string]interface{}{
			"Message": err.Error(),
		})
	} else {
		c.Emitter.Emit("message.produced", map[string]interface{}{
			"CorrelationId": payload.CorrelationId,
			"Status":        "SUCCESS",
		})
	}

}

var consumers map[string]chan int = make(map[string]chan int)

type ConsumePayload struct {
	ConsumerId  string
	ClusterName string
	Topic       string
	Follow      bool
	Offset      int
}

func (c *MessageController) Consume(data interface{}) {
	var payload ConsumePayload
	err := mapstructure.Decode(data, &payload)
	if err != nil {
		log.Println(err)
	}

	logger.Infof("Starting consumer %s from topic %s", payload.ConsumerId, payload.Topic)

	if consumers[payload.ConsumerId] != nil {
		logger.Infof("Consumer %s already active. Sending end signal.", payload.ConsumerId)
		consumers[payload.ConsumerId] <- 1
	}

	var cluster kafka.Cluster = state[payload.ClusterName]

	res := make(chan kgo.Message)

	var args = kafka.ConsumeArgs{
		Topic:  payload.Topic,
		Offset: payload.Offset,
	}
	if payload.Follow {
		end := make(chan int)
		consumers[payload.ConsumerId] = end
		err = cluster.ConsumeAllF(args, res, end)
	} else {
		err = cluster.ConsumeAll(args, res)
	}
	if err != nil {
		log.Println(err)

		c.Emitter.Emit("error", map[string]interface{}{
			"Message": err.Error(),
		})
	}

	go func() {
		logger.Infof("Starting stream on Topic: %s", payload.Topic)
		for msg := range res {
			c.Emitter.Emit("message.consumed", map[string]interface{}{
				"ConsumerId":  payload.ConsumerId,
				"ClusterName": payload.ClusterName,
				"Topic":       payload.Topic,
				"Message":     msg,
				"EOS":         false,
			})
		}

		c.Emitter.Emit("message.consumed", map[string]interface{}{
			"ConsumerId":  payload.ConsumerId,
			"ClusterName": payload.ClusterName,
			"Topic":       payload.Topic,
			"EOS":         true,
		})

		logger.Infof("Stream on Topic: %s closed", payload.Topic)
		consumers[payload.ConsumerId] = nil
	}()
}

type ConsumeStopPayload struct {
	ConsumerId string
}

func (c *MessageController) Stop(data interface{}) {
	var payload ConsumePayload
	err := mapstructure.Decode(data, &payload)
	if err != nil {
		log.Println(err)
	}

	if consumers[payload.ConsumerId] != nil {
		logger.Infof("Sending end signal to consumer %s.", payload.ConsumerId)
		consumers[payload.ConsumerId] <- 1
		// consumers[payload.ConsumerId] = nil
	} else {
		logger.Infof("Consumer %s is not active. Sending EOS.", payload.ConsumerId)
		c.Emitter.Emit("message.consumed", map[string]interface{}{
			"ConsumerId":  payload.ConsumerId,
			"ClusterName": payload.ClusterName,
			"Topic":       payload.Topic,
			"EOS":         true,
		})
	}
}
