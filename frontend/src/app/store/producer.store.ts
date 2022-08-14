import { Injectable } from '@angular/core';
import { createStore, withProps } from '@ngneat/elf';
import { combineLatest, Observable } from 'rxjs';
import { flatMap, map, mergeMap } from 'rxjs/operators';

export interface Producer {
    name: string;
    topic: string;
    message: string;
}

export interface ProducerState {
    [key: string]: Producer;
}

@Injectable({
    providedIn: 'root'
})
export class ProducerStore {
    store = createStore({
        name: 'producer'
    }, withProps<ProducerState>({}));

    getProducer(name$: Observable<string>): Observable<Producer > {
        return combineLatest([
            name$,
            this.store.asObservable()
        ]) .pipe(
            map(([name, state]) => {
                return state[name]
            })
        )
    }
}
