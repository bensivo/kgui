import { Injectable } from '@angular/core';
import { Entity, EntityStore } from './entity.store';

export interface Consumer extends Entity{
    name: string;
    topic: string;
    offset: number;
    follow: boolean;
    filters: string[];
}

@Injectable({
    providedIn: 'root'
})
export class ConsumerStore {
    store = new EntityStore<Consumer>('consumer');
}
