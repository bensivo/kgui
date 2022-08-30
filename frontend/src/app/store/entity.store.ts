import { createStore, select, Store, withProps } from "@ngneat/elf";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export interface Entity {
    id: string;
}

export interface EntityState<T> {
    [key: string]: T;
}

export class EntityStore<T extends Entity> {

    protected store: Store<any, EntityState<T>>;

    constructor(name: string) {
        this.store = createStore(
            {
                name,
            },
            withProps<EntityState<T>>({})
        )
    }

    get state() {
        return this.store.getValue();
    }

    set state(state: EntityState<T>) {
        this.store.update(_ => state);
    }

    get entities$() {
        return this.store.pipe(
            map(s => Object.values(s))
        );
    }

    get(id: string): Observable<T> {
        return this.store.pipe(
            select(s => s[id])
        )
    }

    upsert(entity: T) {
        this.store.update((s) => ({
            ...s,
            [entity.id]: entity,
        }));
    }

    remove(id: string) {
        const state = this.store.getValue();
        delete state[id];
        this.store.update(_ => ({
            ...state
        }));
    }

}