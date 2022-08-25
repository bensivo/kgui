import { Injectable } from '@angular/core';
import { createStore, withProps } from '@ngneat/elf';
import { nanoid }  from 'nanoid';

export interface Consumer {
    id: string;
    name: string;
    topic: string;
    offset: number;
    filters: string[];
}

export interface ConsumerState {
    [key: string]: Consumer
}

@Injectable({
    providedIn: 'root'
})
export class ConsumerStore {
    store = createStore({
        name: 'consumer'
    }, withProps<ConsumerState>({}));


    addConsumer() {
        let name = 'Untitled';
        let id = nanoid();
        let counter = 0;
        const state = this.store.getValue();
        while (!!state[name]) {
            name = `Untitled${++counter > 0 ? counter : ''}`
        }
        this.store.update((s) => ({
            ...s,
            [id]: {
                id,
                name,
                topic: '',
                offset: 0,
                filters: []
            }
        }))
    }

    updateConsumer(id: string, newConsumer: Consumer) {
        console.log('Setting consumer', id, newConsumer)
        const state = this.store.getValue();
        delete state[id];

        this.store.update((s) => ({
            ...s,
            [newConsumer.id]: newConsumer
        }));
    }
}
