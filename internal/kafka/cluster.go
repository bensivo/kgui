package kafka

import (
	"context"
	"crypto/tls"
	"crypto/x509"
	"io/ioutil"
	"strings"
	"time"

	kgo "github.com/segmentio/kafka-go"
	"github.com/segmentio/kafka-go/sasl"
	"github.com/segmentio/kafka-go/sasl/plain"
	"github.com/segmentio/kafka-go/sasl/scram"
	"gitlab.com/bensivo/kgui/internal/logger"
)

type Cluster struct {
	Name                 string
	BootstrapServer      string
	SaslMechanism        string
	SaslUsername         string
	SaslPassword         string
	SSLEnabled           bool
	SSLCaCertificatePath string
	SSLSkipVerification  bool
}

func (c *Cluster) Dial() (*kgo.Conn, error) {
	dialer, err := c.GetDialer()
	if err != nil {
		return nil, err
	}

	conn, err := dialer.Dial("tcp", c.BootstrapServer)
	if err != nil {
		logger.Infoln("Failed to dial leader", err)
		return nil, err
	}

	return conn, nil
}

func (c *Cluster) DialLeader(topic string, partition int) (*kgo.Conn, error) {
	dialer, err := c.GetDialer()
	if err != nil {
		return nil, err
	}

	logger.Infof("Dialing leader for cluster: %s topic: %s", c.Name, topic)
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	conn, err := dialer.DialLeader(ctx, "tcp", c.BootstrapServer, topic, partition)
	if err != nil {
		logger.Infoln("Failed to dial leader", err)
		return nil, err
	}

	return conn, nil
}

func (c *Cluster) GetDialer() (*kgo.Dialer, error) {
	mechanism, err := c.getSaslMechanism()
	if err != nil {
		return nil, err
	}

	tls, err := c.getTLSConfig()
	if err != nil {
		return nil, err
	}

	dialer := &kgo.Dialer{
		Timeout:       time.Second * 10,
		DualStack:     true,
		SASLMechanism: mechanism,
		TLS:           tls,
	}
	return dialer, nil
}

func (c *Cluster) getSaslMechanism() (sasl.Mechanism, error) {
	if strings.ToLower(c.SaslMechanism) == "plain" {
		return plain.Mechanism{
			Username: c.SaslUsername,
			Password: c.SaslPassword,
		}, nil
	}
	if strings.ToLower(c.SaslMechanism) == "scram-sha-512" {
		mechanism, err := scram.Mechanism(scram.SHA512, c.SaslUsername, c.SaslPassword)
		if err != nil {
			logger.Infoln("Error configuring scram-sha-512 auth")
			return nil, err
		}
		return mechanism, nil
	}
	if strings.ToLower(c.SaslMechanism) == "scram-sha-256" {
		mechanism, err := scram.Mechanism(scram.SHA256, c.SaslUsername, c.SaslPassword)
		if err != nil {
			logger.Infoln("Error configuring scram-sha-256 auth")
			return nil, err
		}
		return mechanism, nil
	}

	return nil, nil
}

func (c *Cluster) getTLSConfig() (*tls.Config, error) {
	if !c.SSLEnabled {
		return nil, nil
	}

	var tlsConfig tls.Config = tls.Config{
		Certificates: []tls.Certificate{},
	}

	if c.SSLCaCertificatePath != "" {
		caCert, err := ioutil.ReadFile("./test/clusters/ssl/ca_authority/ca-cert")
		if err != nil {
			return nil, err
		}

		caCertPool := x509.NewCertPool()
		caCertPool.AppendCertsFromPEM(caCert)
		tlsConfig.RootCAs = caCertPool
	}

	if c.SSLSkipVerification {
		tlsConfig.InsecureSkipVerify = true
	}

	return &tlsConfig, nil
}
