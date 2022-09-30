import { Component } from "@angular/core";
import { combineLatest, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Consumer, ConsumerStore } from "src/app/store/consumer.store";
import { Producer, ProducerStore } from "src/app/store/producer.store";
import { Tab, TabStore } from "src/app/store/tab.store";

export interface TabData extends Tab {
  name: string;
}

@Component({
    selector: 'app-tabs',
    template: `
      <app-tabs-component *ngIf="(tabs$ | async) as tabs" [tabs]="tabs" [selectedIndex]="(selectedIndex$ | async) || 0"></app-tabs-component>
    `,
    styles: [],
  })
  export class TabsContainer {
    constructor(private tabStore: TabStore, private consumerStore: ConsumerStore, private producerStore: ProducerStore) { }

    tabs$: Observable<TabData[]> = combineLatest([this.tabStore.store.entities$, this.consumerStore.store.entities$, this.producerStore.store.entities$])
    .pipe(
      map(([tabs, consumers, producers]) => {
        const consumerMap: Record<string, Consumer> = {};
        for(let i=0; i<consumers.length; i++) {
          consumerMap[consumers[i].id] = consumers[i]
        }
        const producerMap: Record<string, Producer> = {};
        for(let i=0; i<producers.length; i++) {
          producerMap[producers[i].id] = producers[i]
        }

        return tabs.map(t => ({
          ...t,
          name: t.targetType === 'consumer' ? consumerMap[t.targetId].name : producerMap[t.targetId].name
        }))
      })
    )

    selectedIndex$ = this.tabs$.pipe(
      map(tabs => tabs.findIndex(t => t.active))
    )
  }