import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Entity, EntityStore } from './entity.store';

export interface Tab extends Entity {
    active: boolean;
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

   get tabs$(): Observable<Tab[]> {
    return this.store.entities$
   }
}
