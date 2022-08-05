import { Injectable } from '@angular/core';
import { createStore, withProps } from '@ngneat/elf';

export interface ClusterState {
    clusters: any[];
}

@Injectable({
    providedIn: 'root'
})
export class ClusterStore {
    store = createStore({
        name: 'cluster'
    }, withProps<ClusterState>({
        clusters: []
    }));
}
