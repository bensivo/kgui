import { Injectable } from "@angular/core";
import * as wails from '../../../wailsjs/go/main/App';
import { EmitterService } from "../emitter/emitter.service";
import { ClusterStore, Cluster } from "../store/cluster.store";
import { NavStore, NavState } from "../store/nav.store";
import { Consumer, ConsumerStore } from "../store/consumer.store";
import { Producer, ProducerStore } from "../store/producer.store";
import { TabStore } from "../store/tab.store";

export interface PersistedState {
    version: 1,
    clusters: Cluster[],
    consumers: Consumer[],
    producers: Producer[],
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
        private tabStore: TabStore,
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
            nav: this.navStore.store.state,
            clusters: this.clusterStore.store.entities,
            consumers: this.consumerStore.store.entities,
            producers: this.producerStore.store.entities,
        }

        console.log('Persisting state', state);

        if (!!(window as any).runtime) {
            // If running in wails desktop env
            wails.Save(state);
        } else {
            // If running in web browser env
            const data = JSON.stringify(state);
            const encoded = 'data:text/json;charset=utf-8,' + encodeURIComponent(data);

            var element = document.createElement('a');
            element.setAttribute('href', encoded);
            element.setAttribute('download', 'project.kgui');
            element.click();
        }
    }

    load(state: PersistedState) {
        this.tabStore.clear();

        console.log('Loading state', state);
        this.clusterStore.store.entities = state.clusters;
        this.consumerStore.store.entities = state.consumers;
        this.producerStore.store.entities = state.producers;
        this.navStore.store.update(s => state.nav)
    }
}
