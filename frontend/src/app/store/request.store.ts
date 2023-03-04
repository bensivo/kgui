import { Injectable } from '@angular/core';
import { createStore, withProps } from '@ngneat/elf';
import { EmitterService } from '../emitter/emitter.service';

export interface Request {
    correlationId: string;
    status: string;
    producerId: string;
    data: any;
}

export interface RequestState {
    [id: string]: Request;
}

@Injectable({
    providedIn: 'root'
})
export class RequestStore {
    store = createStore({
        name: 'request'
    }, withProps<RequestState>({ }));

    constructor(private emitterService: EmitterService){
        // TODO: should we put this in an app-wide init?
        this.init();
    }

    init() {
        this.emitterService.emitter.stream<any>('message.produced')
        .subscribe((msg: {CorrelationId: string, Status: string}) => {
            this.update(msg.CorrelationId, msg.Status)
        })
    }

    add(request: Request){
        this.store.update((s) => ({
            ...s,
            [request.correlationId]: request
        }));
    }

    update(correlationId: string, status: string) {
        this.store.update((s) => ({
            ...s,
            [correlationId]: {
                ...s[correlationId],
                status,
            }
        }));
    }
}
