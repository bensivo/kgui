package controller

import (
	"log"

	"github.com/mitchellh/mapstructure"
	"gitlab.com/bensivo/kgui/internal/emitter"
	"gitlab.com/bensivo/kgui/internal/kafka"
)

type ClusterController struct {
	Emitter emitter.Emitter
}

var state map[string]kafka.Cluster = make(map[string]kafka.Cluster)

type ListClustersResponse struct {
	Topic string
	Data  []kafka.Cluster
}

func NewClusterController(e emitter.Emitter) *ClusterController {
	c := &ClusterController{
		Emitter: e,
	}

	return c
}

func (c *ClusterController) RegisterHandlers() {
	c.Emitter.On("clusters.refresh", c.listClusters)
	c.Emitter.On("clusters.add", c.addCluster)
	c.Emitter.On("clusters.remove", c.removeCluster)
}

func (c *ClusterController) listClusters(_msg interface{}) {
	log.Println("Listing clusters")

	clusters := make([]kafka.Cluster, 0, len(state))
	for _, value := range state {
		clusters = append(clusters, value)
	}
	c.Emitter.Emit("clusters.changed", clusters)
}

func (c *ClusterController) addCluster(data interface{}) {

	var cluster kafka.Cluster
	err := mapstructure.Decode(data, &cluster)
	if err != nil {
		log.Println(err)
	}

	log.Printf("Adding Cluster %s - %v\n", cluster.Name, cluster)

	state[cluster.Name] = cluster

	clusters := make([]kafka.Cluster, 0, len(state))
	for _, value := range state {
		clusters = append(clusters, value)
	}

	c.Emitter.Emit("clusters.changed", clusters)
}

type RemoveClusterPayload struct {
	Name string
}

func (c *ClusterController) removeCluster(data interface{}) {
	log.Println("Removing Cluster")

	var payload RemoveClusterPayload
	err := mapstructure.Decode(data, &payload)
	if err != nil {
		log.Println(err)
	}

	log.Printf("Removing Cluster %s\n", payload.Name)

	delete(state, payload.Name)

	clusters := make([]kafka.Cluster, 0, len(state))
	for _, value := range state {
		clusters = append(clusters, value)
	}
	c.Emitter.Emit("clusters.changed", clusters)
}
