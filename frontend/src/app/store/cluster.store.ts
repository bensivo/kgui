import { Injectable } from '@angular/core';
import { createStore, withProps } from '@ngneat/elf';

export interface Cluster {
    BootstrapServer: string;
    Name: string;
    SSLCaCertificatePath: string;
    SSLEnabled: boolean;
    SSLSkipVerification: boolean;
    SaslMechanism: string;
    SaslPassword: string;
    SaslUsername: string;
}

export interface ClusterState {
    clusters: Cluster[];
    active?: Cluster;
}

@Injectable({
    providedIn: 'root'
})
export class ClusterStore {
    store = createStore({
        name: 'cluster'
    }, withProps<ClusterState>({
        clusters: [],
    }));

    get state() {
        return this.store.getValue();
    }
}
