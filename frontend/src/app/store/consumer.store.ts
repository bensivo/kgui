import { Injectable } from '@angular/core';
import { createStore, select, withProps } from '@ngneat/elf';
import { nanoid } from 'nanoid';
import { Observable } from 'rxjs';
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
    store = createStore({
        name: 'consumer'
    }, withProps<ConsumerState>({}));

    consumers$ = this.store.pipe(
        select((state) => {
            console.log('newConsumers')
            const consumers = Object.values(state);
            consumers.sort((a, b) => a.name.localeCompare(b.name))
            return consumers;
        })
    )

    get state() {
        return this.store.getValue();
    }

    add(dto: Partial<Consumer>) {
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
            [consumer.id]: consumer,
        }))
    }

    get(name: string): Observable<Consumer> {
        return this.store.pipe(
            map(s => s[name])
        )
    }

    update(id: string, newConsumer: Consumer) {
        console.log('Setting consumer', id, newConsumer)
        const state = this.store.getValue();
        delete state[id];

        this.store.update((s) => ({
            ...s,
            [newConsumer.id]: newConsumer
        }));
    }

    delete(id: string) {
        console.log('Deleting consumer', id)
        const state = this.store.getValue();
        delete state[id];
        this.store.update(_ => ({
            ...state
        }))
    }
}
