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

    constructor(name: string, initial: T[] = []) {
        this.store = createStore(
            {
                name,
            },
            withProps<EntityState<T>>({})
        )

        for(const i of initial) {
            this.upsert(i)
        }
    }

    get state() {
        return this.store.getValue();
    }

    set state(state: EntityState<T>) {
        this.store.update(_ => state);
    }

    get entities() {
        return Object.values(this.state);
    }

    set entities(entities: T[]) {
        const state: Record<string, T> = {};
        for(let i=0; i<entities.length; i++) {
            state[entities[i].id] = entities[i]
        }
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

    update(id: string, dto: Omit<Partial<T>, 'id'>) {
        const entity = this.store.state[id];
        if (!entity) {
            throw new Error(`Entity ${id} not found`);
        }

        this.store.update((s) => ({
            ...s,
            [entity.id]: {
                ...entity,
                ...dto
            },
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