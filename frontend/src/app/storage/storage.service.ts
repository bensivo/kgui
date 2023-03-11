import { Injectable } from "@angular/core";
import * as wails from '../../../wailsjs/go/main/App';
import { EmitterService } from "../emitter/emitter.service";
import { ClusterState, ClusterStore } from "../store/cluster.store";
import { NavStore, NavState } from "../store/nav.store";
import { Consumer, ConsumerStore } from "../store/consumer.store";
import { Producer, ProducerStore } from "../store/producer.store";

export interface PersistedState {
    version: 1,
    cluster: ClusterState,
    consumer: Consumer[],
    producer: Producer[],
    nav: NavState;
}

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    constructor(
        private clusterStore: ClusterStore,
        private consumerStore: ConsumerStore,
        private producerStore: ProducerStore,
        private navStore: NavStore,
        private emitterService: EmitterService
    ) { }

    initialize() {
        this.emitterService.emitter.stream('save.requested').subscribe(() => {
            this.save();
        });

        this.emitterService.emitter.stream<PersistedState>('load.requested').subscribe((data) => {
            this.load(data);
        });
    }

    save() {
        const state: PersistedState = {
            version: 1,
            cluster: this.clusterStore.state,
            nav: this.navStore.store.state,
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

        this.navStore.store.update(s => state.nav)

        for (const cluster of state.cluster.clusters) {
            this.emitterService.emitter.send({
                Topic: 'clusters.add',
                Data: {
                    ...cluster
                },
            });
        }
    }
}
