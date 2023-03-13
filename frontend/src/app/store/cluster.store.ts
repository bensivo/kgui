import { Injectable } from '@angular/core';
import { createStore, withProps } from '@ngneat/elf';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { Entity, EntityStore } from './entity.store';

export interface Cluster extends Entity{
    BootstrapServer: string;
    Name: string;
    SSLCaCertificatePath: string;
    SSLEnabled: boolean;
    SSLSkipVerification: boolean;
    SaslMechanism: string;
    SaslPassword: string;
    SaslUsername: string;
}

export interface ActiveClusterState {
    cluster?: Cluster;
}

@Injectable({
    providedIn: 'root'
})
export class ClusterStore {
    store = new EntityStore<Cluster>('cluster');

    private active = new BehaviorSubject<Cluster | null>(null);
    active$ = this.active.asObservable()

    setActive(c: Cluster) {
        this.active.next(c);
    }

    init() {
        combineLatest([
            this.store.entities$,
            this.active$,
        ])
        .subscribe(([clusters, active]) => {
            if (!active && clusters.length > 0) {
                console.log('Setting active cluster', clusters[0])
                return this.active.next(clusters[0])
            }
            if (clusters.length === 0 && active) {
                console.log('no more clusters')
                this.active.next(null);
            }
        })
    }
}
