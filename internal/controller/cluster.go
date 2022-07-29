package controller

import (
	"log"

	"github.com/gorilla/websocket"
	"github.com/mitchellh/mapstructure"
)

type ClusterController struct {
	Conn *websocket.Conn
}

type Cluster struct {
	Name                 string
	BootstrapServer      string
	Timeout              int64
	SaslMechanism        string
	SaslUsername         string
	SaslPassword         string
	SSLEnabled           bool
	SSLCaCertificatePath string
	SSLSkipVerification  bool
}

type RemoveClusterPayload struct {
	Name string
}

var state map[string]Cluster = make(map[string]Cluster)

type ListClustersResponse struct {
	Topic string
	Data  []Cluster
}

func (c *ClusterController) Handle(msg Message) {
	switch msg.Topic {
	case "req.clusters.list":
		c.listClusters()
	case "req.clusters.add":
		c.addCluster(msg.Data)
	case "req.clusters.remove":
		c.removeCluster(msg.Data)
	}
}

func (c *ClusterController) listClusters() {
	log.Println("Listing clusters")

	clusters := make([]Cluster, 0, len(state))
	for _, value := range state {
		clusters = append(clusters, value)
	}
	write(*c.Conn, "res.clusters.list", clusters)
}

func (c *ClusterController) addCluster(data interface{}) {

	var cluster Cluster
	err := mapstructure.Decode(data, &cluster)
	if err != nil {
		log.Fatal(err)
	}

	log.Printf("Adding Cluster %s - %v\n", cluster.Name, cluster)

	state[cluster.Name] = cluster

	clusters := make([]Cluster, 0, len(state))
	for _, value := range state {
		clusters = append(clusters, value)
	}

	write(*c.Conn, "res.clusters.add", clusters)
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

	clusters := make([]Cluster, 0, len(state))
	for _, value := range state {
		clusters = append(clusters, value)
	}
	write(*c.Conn, "res.clusters.remove", clusters)
}
