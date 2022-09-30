import { Injectable } from "@angular/core";
import * as wails from '../../../wailsjs/go/main/App';
import { SocketService } from "../socket/socket.service";
import { ClusterState, ClusterStore } from "../store/cluster.store";
import { Consumer, ConsumerStore } from "../store/consumer.store";
import { Producer, ProducerStore } from "../store/producer.store";

export interface PersistedState {
    cluster: ClusterState,
    consumer: Consumer[],
    producer: Producer[],
}

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    constructor(
        private clusterStore: ClusterStore,
        private consumerStore: ConsumerStore,
        private producerStore: ProducerStore,
        private socketService: SocketService
    ) { }

    initialize() {
        this.socketService.stream('save.requested').subscribe(() => {
            this.save();
        });

        this.socketService.stream<PersistedState>('load.requested').subscribe((data) => {
            this.load(data);
        });

        // this.load({
        //     "cluster": {
        //         "active": {
        //             "BootstrapServer": "10.0.0.62:30100",
        //             "Name": "qa-gateway",
        //             "SSLCaCertificatePath": "",
        //             "SSLEnabled": true,
        //             "SSLSkipVerification": true,
        //             "SaslMechanism": "scram-sha-512",
        //             "SaslPassword": "kafkapassword",
        //             "SaslUsername": "admin-user"
        //         },
        //         "clusters": [{
        //             "BootstrapServer": "10.0.0.62:30100",
        //             "Name": "qa-gateway",
        //             "SSLCaCertificatePath": "",
        //             "SSLEnabled": true,
        //             "SSLSkipVerification": true,
        //             "SaslMechanism": "scram-sha-512",
        //             "SaslPassword": "kafkapassword",
        //             "SaslUsername": "admin-user"
        //         },
        //         {
        //             "BootstrapServer": "dev-gateway.deming.spacee.io:30100",
        //             "Name": "dev-gateway",
        //             "SSLCaCertificatePath": "",
        //             "SSLEnabled": true,
        //             "SSLSkipVerification": true,
        //             "SaslMechanism": "scram-sha-512",
        //             "SaslPassword": "kafkapassword",
        //             "SaslUsername": "admin-user"
        //         },
        //         {
        //             "BootstrapServer": "staging-gateway.deming.spacee.io:30100",
        //             "Name": "staging-gateway",
        //             "SSLCaCertificatePath": "",
        //             "SSLEnabled": true,
        //             "SSLSkipVerification": true,
        //             "SaslMechanism": "scram-sha-512",
        //             "SaslPassword": "kafkapassword",
        //             "SaslUsername": "admin-user"
        //         }
        //         ]
        //     },
        //     "consumer": [{
        //         "filters": [],
        //         "id": "8N1f0pMwPMfdF08vwdpo4",
        //         "name": "Observr Telemetry",
        //         "offset": -1,
        //         "topic": "observr.report.telemetry"
        //     },
        //     {
        //         "filters": [],
        //         "id": "gLz20p7l7FtQOsE46CPfS",
        //         "name": "Rovr Telemetry",
        //         "offset": -1,
        //         "topic": "rovr.report.telemetry"
        //     },
        //     {
        //         "filters": [],
        //         "id": "m2aE2A05bVaYnMHJlBVB9",
        //         "name": "Event Stream",
        //         "offset": -20,
        //         "topic": "deming.event.stream"
        //     }
        //     ],
        //     "producer": [{
        //         "id": "Sz1anV4KvxF-xRV-6Z7uz",
        //         "message": "{\"data\": {\"eventName\": \"PRICETAG_DETECTION_COMPLETE_OBSERVR\", \"eventVersion\": \"1.0\", \"messageProducerName\": \"object-detector\", \"payload\": {\"dsn\": \"001f7b319cfc\", \"railId\": \"6131cbd3-af71-4b73-8bd1-5442734067e7\", \"description\": \"Inference (pricetag detection) is completed\"}}, \"meta\": {\"type\": \"deming.event.stream\", \"correlationId\": \"91f52e2c-d8aa-44e1-a1d5-c9d4053d4f71\", \"timestamp\": \"2022-09-02T20:15:10+00:00\"}}",
        //         "name": "Event Stream",
        //         "partition": 0,
        //         "topic": "deming.event.stream"
        //     }]
        // })


    }

    save() {
        const state = {
            cluster: this.clusterStore.state,
            consumer: this.consumerStore.store.entities,
            producer: this.producerStore.store.entities,
        }

        console.log('Persisting state', state);
        wails.Save(state);
    }

    load(state: PersistedState) {
        console.log('Loading state', state);
        this.consumerStore.store.entities = state.consumer;
        this.producerStore.store.entities = state.producer;

        for (const cluster of state.cluster.clusters) {
            this.socketService.send({
                Topic: 'clusters.add',
                Data: {
                    ...cluster
                },
            });
        }
    }
}
