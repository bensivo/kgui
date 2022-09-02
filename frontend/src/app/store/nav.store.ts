import { Injectable } from "@angular/core";
import { createStore, withProps } from "@ngneat/elf";

@Injectable({
    providedIn: 'root'
})
export class NavStore {
    store = createStore({name: 'nav'}, withProps({
        expanded: true,
    }));
}