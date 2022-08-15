import { Injectable } from '@angular/core';
import { createStore, withProps } from '@ngneat/elf';
import { SocketService } from '../socket/socket.service';

export interface Request {
    correlationId: string;
    status: string;
    producerName: string;
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

    constructor(private socketService: SocketService){
        // TODO: should we put this in an app-wide init?
        this.init();
    }

    init() {
        this.socketService.stream<any>('message.produced')
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
