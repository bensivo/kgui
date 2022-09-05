import { Injectable } from "@angular/core";
import * as wails from '../../../wailsjs/go/main/App';
import { SocketService } from "../socket/socket.service";
import { ClusterState, ClusterStore } from "../store/cluster.store";
import { Consumer, ConsumerStore } from "../store/consumer.store";
import { EntityState } from "../store/entity.store";
import { Producer, ProducerStore } from "../store/producer.store";

export interface PersistedState {
    cluster: ClusterState,
    consumer: EntityState<Consumer>,
    producer: EntityState<Producer>,
}

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    constructor (
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
    }

    save() {
        const state = {
            cluster: this.clusterStore.state,
            consumer: this.consumerStore.store.state,
            producer: this.producerStore.store.state,
        }

        console.log('Persisting state', state);
        wails.Save(state);
    }

    load(state: PersistedState) {
        console.log('Loading state', state);
        this.clusterStore.store.update((s) => state.cluster );
        this.consumerStore.store.state = state.consumer;
        this.producerStore.store.state =  state.producer;
    }
}
