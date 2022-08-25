import { Injectable } from '@angular/core';
import { createStore, select, withProps } from '@ngneat/elf';
import { nanoid }  from 'nanoid';
import { map } from 'rxjs/operators';

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
    private store = createStore({
        name: 'consumer'
    }, withProps<ConsumerState>({}));

    consumers$ = this.store.pipe(
        select((state)=> {
            console.log('newConsumers')
            const consumers = Object.values(state);
            consumers.sort((a,b) => a.name.localeCompare(b.name) )
            return consumers;
        })
    )

    consumer(name: string) {
        return this.store.pipe(
            map(s => s[name])
        )
    }

    addConsumer(dto: Partial<Consumer>) {
        const defaults: Consumer = {
            id: nanoid(),
            name: 'Untitled',
            topic: '',
            offset: 0,
            filters: []
        };
        const consumer = {
            ...defaults,
            ...dto,
        };
        this.store.update((s) => ({
            ...s,
            [consumer.id]: consumer ,
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

    deleteConsumer(id: string) {
        console.log('Deleting consumer', id)
        const state = this.store.getValue();
        delete state[id];
        this.store.update(_ => ({
            ...state
        }))
    }
}
