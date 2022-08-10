import { Injectable } from '@angular/core';
import { createStore, withProps } from '@ngneat/elf';

export interface Producer {
    name: string;
    topic: string;
    message: string;
}

export interface ProducerState {
    [key: string]: Producer;
}

@Injectable({
    providedIn: 'root'
})
export class ProducerStore {
    store = createStore({
        name: 'consumer'
    }, withProps<ProducerState>({}));
}
