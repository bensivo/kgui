import { Component } from "@angular/core";
import { map } from "rxjs/operators";
import { TabStore } from "src/app/store/tab.store";

@Component({
    selector: 'app-tab-content',
    template: `
      <app-tab-content-component *ngIf="(tab$ | async) as tab" [tab]="tab"></app-tab-content-component>
    `,
    styles: [],
  })
  export class TabContentContainer {
    constructor(private tabStore: TabStore) { }

    tab$ = this.tabStore.store.entities$.pipe(
      map((tabs) => {

        const t = tabs.find((t) => t.active)
        console.log(t);
        return t;
      })
    );

    // TODO: Create an observable that gets consumer or producer information based on information in the tab

  }