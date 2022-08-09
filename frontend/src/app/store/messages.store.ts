import { Injectable } from '@angular/core';
import { createStore, withProps } from '@ngneat/elf';

export interface MessagesState {
    [consumerName: string]: any[];
}

@Injectable({
    providedIn: 'root'
})
export class MessagesStore {
    store = createStore({
        name: 'messages'
    }, withProps<MessagesState>({}));
}
