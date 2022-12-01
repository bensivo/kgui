import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SocketService } from '../socket/socket.service';
import { Entity, EntityStore } from './entity.store';

export interface Tab extends Entity {
    active: boolean;
    targetType: 'consumer' | 'producer';
    targetId: string;
}

@Injectable({
    providedIn: 'root'
})
export class TabStore {
    store = new EntityStore<Tab>('tab', []);

    constructor(private socketService: SocketService) { }

    selectTab(id: string) {
        this.store.entities = this.store.entities.map((t) => ({
            ...t,
            active: t.id === id
        }));
    }

    removeTab(id: string) {
        // Determine if this is the active tab. If so, set the next active tab.
        const tabs = this.store.entities;
        const index = tabs.findIndex(t => t.id === id);
        if (index < 0) {
            console.error(`Cannot remove tab ${id}, not found.`);
            return;
        }

        const tab = tabs[index];
        if (tab.targetType === 'consumer') {
            this.socketService.send({
                Topic: 'message.stop',
                Data: {
                    ConsumerId: tab.targetId,
                }
            });
        }

        tabs.splice(index, 1);

        // Select either the next tab, or the last tab in the list
        if (tab.active && tabs.length > 0) {
            const nextActiveIndex = Math.min(index, tabs.length - 1);
            tabs[nextActiveIndex].active = true;
        }

        this.store.entities = tabs;
    }

    get tabs$(): Observable<Tab[]> {
        return this.store.entities$
    }
}
