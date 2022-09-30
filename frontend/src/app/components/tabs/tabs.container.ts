import { Component } from "@angular/core";
import { map, startWith } from "rxjs/operators";
import { TabStore } from "src/app/store/tab.store";

@Component({
    selector: 'app-tabs',
    template: `
      <app-tabs-component *ngIf="(tabs$ | async) as tabs" [tabs]="tabs" [selectedIndex]="(selectedIndex$ | async) || 0"></app-tabs-component>
    `,
    styles: [],
  })
  export class TabsContainer {
    constructor(private tabStore: TabStore) { }
    tabs$ = this.tabStore.store.entities$;

    selectedIndex$ = this.tabs$.pipe(
      map(tabs => tabs.findIndex(t => t.active))
    )
  }