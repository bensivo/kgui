import { Injectable } from '@angular/core';
import { Entity, EntityStore } from './entity.store';

export interface Tab extends Entity {
    active: boolean;
    name: string;
    targetType: 'consumer' | 'producer';
    targetId:  string;
}

@Injectable({
    providedIn: 'root'
})
export class TabStore {
   store = new EntityStore<Tab>('tab', [ ]);

   selectTab(id: string) {
    this.store.entities = this.store.entities.map((t) => ({
        ...t,
        active: t.id === id
    }));
   }
}
