import { Injectable } from "@angular/core";
import { ClusterState, ClusterStore } from "../store/cluster.store";
import { ConsumerState, ConsumerStore } from "../store/consumer.store";
import { ProducerState, ProducerStore } from "../store/producer.store";
import * as wails from '../../../wailsjs/go/main/App';
import { Message, SocketService } from "../socket/socket.service";

export interface PersistedState {
    cluster: ClusterState,
    consumer: ConsumerState,
}

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    constructor (
        private clusterStore: ClusterStore,
        private consumerStore: ConsumerStore,
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
            consumer: this.consumerStore.state,
        }

        console.log('Persisting state', state);
        wails.Save(state);
    }

    load(state: PersistedState) {
        console.log('Loading state', state);
        this.clusterStore.store.update((s) => state.cluster );
        this.consumerStore.store.update((s) => state.consumer );
    }
}