import { Injectable } from '@angular/core';
import { Entity, EntityStore } from './entity.store';

export interface Tab extends Entity {
    active: boolean;
    sequence: number;
    name: string;
}

@Injectable({
    providedIn: 'root'
})
export class TabStore {
   store = new EntityStore<Tab>('tab', [ ]);
}
