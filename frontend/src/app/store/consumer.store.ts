import { Injectable } from '@angular/core';
import { createStore, withProps } from '@ngneat/elf';

export interface Consumer {
    name: string;
    topic: string;
    offset: number;
    messages: any[];
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
}
