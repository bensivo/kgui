package kafka

import (
	"fmt"
	"os"
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
		fmt.Println(err)
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
