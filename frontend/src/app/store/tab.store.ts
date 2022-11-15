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
        this.store.get(id)
            .subscribe((tab) => {
                if (tab.targetType === 'consumer') {
                    this.socketService.send({
                        Topic: 'message.stop',
                        Data: {
                            ConsumerId: tab.targetId,
                        }
                    });
                }
                this.store.remove(id);
            })
    }

    get tabs$(): Observable<Tab[]> {
        return this.store.entities$
    }
}
