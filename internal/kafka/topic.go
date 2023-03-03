package kafka

import (
	"os"

	"gitlab.com/bensivo/kgui/internal/logger"
)

type TopicMetadata struct {
	Name          string
	NumPartitions int
}

func (c *Cluster) GetTopics() (map[string]TopicMetadata, error) {
	conn, err := c.Dial()
	if err != nil {
		return nil, err
	}

	defer conn.Close()

	partitions, err := conn.ReadPartitions()
	if err != nil {
		logger.Error(err)
		os.Exit(1)
	}

	topics := make(map[string]TopicMetadata)
	for _, partition := range partitions {
		name := partition.Topic

		topic, exists := topics[name]
		if !exists {
			topics[name] = TopicMetadata{
				Name:          name,
				NumPartitions: 1,
			}
			continue
		} else {
			topic.NumPartitions++
			topics[name] = topic
		}
	}

	return topics, nil
}
