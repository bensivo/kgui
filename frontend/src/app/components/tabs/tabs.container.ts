import { Component } from "@angular/core";
import { TabStore } from "src/app/store/tab.store";

@Component({
    selector: 'app-tabs',
    template: `
      <app-tabs-component *ngIf="(tabs$ | async) as tabs" [tabs]="tabs"></app-tabs-component>
    `,
    styles: [],
  })
  export class TabsContainer {
    constructor(private tabStore: TabStore) { }
    tabs$ = this.tabStore.store.entities$;
  }