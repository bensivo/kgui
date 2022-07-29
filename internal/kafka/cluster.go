package kafka

import (
	"context"
	"crypto/tls"
	"crypto/x509"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"strings"
	"time"

	kgo "github.com/segmentio/kafka-go"
	"github.com/segmentio/kafka-go/sasl"
	"github.com/segmentio/kafka-go/sasl/plain"
	"github.com/segmentio/kafka-go/sasl/scram"
)

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

func (c *Cluster) Dial() *kgo.Conn {
	dialer := c.GetDialer()

	conn, err := dialer.Dial("tcp", c.BootstrapServer)
	if err != nil {
		fmt.Println("Failed to dial leader", err)
		os.Exit(1)
	}

	return conn
}

func (c *Cluster) DialLeader(topic string, partition int) *kgo.Conn {
	dialer := c.GetDialer()

	fmt.Println("Dialing leader for cluster " + c.BootstrapServer)
	ctx, _ := context.WithTimeout(context.Background(), time.Duration(c.Timeout)*time.Second)
	conn, err := dialer.DialLeader(ctx, "tcp", c.BootstrapServer, topic, partition)
	if err != nil {
		fmt.Println("Failed to dial leader", err)
		os.Exit(1)
	}

	return conn
}

func (c *Cluster) GetDialer() *kgo.Dialer {
	dialer := &kgo.Dialer{
		Timeout:       time.Second * 10,
		DualStack:     true,
		SASLMechanism: c.getSaslMechanism(),
		TLS:           c.getTLSConfig(),
	}
	return dialer
}

func (c *Cluster) getSaslMechanism() sasl.Mechanism {
	if strings.ToLower(c.SaslMechanism) == "plain" {
		return plain.Mechanism{
			Username: c.SaslUsername,
			Password: c.SaslPassword,
		}
	}
	if strings.ToLower(c.SaslMechanism) == "scram-sha-512" {
		mechanism, err := scram.Mechanism(scram.SHA512, c.SaslUsername, c.SaslPassword)
		if err != nil {
			fmt.Println("Error configuring scram-sha-512 auth")
			os.Exit(1)
		}
		return mechanism
	}
	if strings.ToLower(c.SaslMechanism) == "scram-sha-256" {
		mechanism, err := scram.Mechanism(scram.SHA256, c.SaslUsername, c.SaslPassword)
		if err != nil {
			fmt.Println("Error configuring scram-sha-256 auth")
			os.Exit(1)
		}
		return mechanism
	}

	return nil
}

func (c *Cluster) getTLSConfig() *tls.Config {
	if !c.SSLEnabled {
		return nil
	}

	var tlsConfig tls.Config = tls.Config{
		Certificates: []tls.Certificate{},
	}

	if c.SSLCaCertificatePath != "" {
		caCert, err := ioutil.ReadFile("./test/clusters/ssl/ca_authority/ca-cert")
		if err != nil {
			log.Fatal(err)
		}

		caCertPool := x509.NewCertPool()
		caCertPool.AppendCertsFromPEM(caCert)
		tlsConfig.RootCAs = caCertPool
	}

	if c.SSLSkipVerification {
		tlsConfig.InsecureSkipVerify = true
	}

	return &tlsConfig
}
