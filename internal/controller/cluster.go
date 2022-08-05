package controller

import (
	"log"

	"github.com/gorilla/websocket"
	"github.com/mitchellh/mapstructure"
	"gitlab.com/bensivo/kgui/internal/kafka"
)

type ClusterController struct {
	Conn *websocket.Conn
}

var state map[string]kafka.Cluster = make(map[string]kafka.Cluster)

type ListClustersResponse struct {
	Topic string
	Data  []kafka.Cluster
}

func (c *ClusterController) Handle(msg Message) {
	switch msg.Topic {
	case "clusters.refresh":
		c.listClusters()
	case "clusters.add":
		c.addCluster(msg.Data)
	case "clusters.remove":
		c.removeCluster(msg.Data)
	}
}

func (c *ClusterController) listClusters() {
	log.Println("Listing clusters")

	clusters := make([]kafka.Cluster, 0, len(state))
	for _, value := range state {
		clusters = append(clusters, value)
	}
	write(*c.Conn, "clusters.changed", clusters)
}

func (c *ClusterController) addCluster(data interface{}) {

	var cluster kafka.Cluster
	err := mapstructure.Decode(data, &cluster)
	if err != nil {
		log.Fatal(err)
	}

	log.Printf("Adding Cluster %s - %v\n", cluster.Name, cluster)

	state[cluster.Name] = cluster

	clusters := make([]kafka.Cluster, 0, len(state))
	for _, value := range state {
		clusters = append(clusters, value)
	}

	write(*c.Conn, "clusters.changed", clusters)
}

type RemoveClusterPayload struct {
	Name string
}

func (c *ClusterController) removeCluster(data interface{}) {
	log.Println("Removing Cluster")

	var payload RemoveClusterPayload
	err := mapstructure.Decode(data, &payload)
	if err != nil {
		log.Fatal(err)
	}

	log.Printf("Removing Cluster %s\n", payload.Name)

	delete(state, payload.Name)

	clusters := make([]kafka.Cluster, 0, len(state))
	for _, value := range state {
		clusters = append(clusters, value)
	}
	write(*c.Conn, "clusters.changed", clusters)
}
