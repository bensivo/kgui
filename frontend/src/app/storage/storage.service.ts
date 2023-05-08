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

    private filename: string = 'project.kgui';

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

        this.emitterService.emitter.stream<PersistedState>('load.requested').subscribe(() => {
            this.emitterService.emitter.send({
                Topic: 'load.requested',
                Data: {},
            });
        });

        this.emitterService.emitter.stream<PersistedState>('load.data').subscribe((data) => {
            this.load(data);
        });
    }

    setFilename(filename: string) {
        this.filename = filename;
    }

    async save() {
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
            // // If running in web browser env
            const data = JSON.stringify(state);
            const fileHandle = await (window as any).showSaveFilePicker({ 
                startIn: 'downloads',
                suggestedName: this.filename

            });
            const writable = await fileHandle.createWritable();
            await writable.write(data);
            await writable.close();
        }
    }

    async loadFile() {
        const fileHandles = await (window as any).showOpenFilePicker({
            startIn: 'downloads',
          });
          if (fileHandles.length > 0) {
            const file = await fileHandles[0].getFile();
            this.setFilename(file.name);
            const contents = await file.text();
            const data = JSON.parse(contents);
            this.load(data);
          } else {
            throw new Error('No files selected')
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
