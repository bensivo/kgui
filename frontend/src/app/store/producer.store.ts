import { Injectable } from '@angular/core';
import { Entity, EntityStore } from './entity.store';

export interface Producer extends Entity{
    name: string;
    topic: string;
    message: string;
    partition: number;
}

@Injectable({
    providedIn: 'root'
})
export class ProducerStore {

   store = new EntityStore<Producer>('producer')
}
