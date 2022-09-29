import { Component, Input, OnInit } from '@angular/core';
import { nanoid } from 'nanoid';
import { NzTabPosition } from 'ng-zorro-antd/tabs';
import { Tab, TabStore } from 'src/app/store/tab.store';
import * as uuid from 'uuid';


@Component({
  selector: 'app-tabs-component',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.less']
})
export class TabsComponent{
  @Input()
  tabs!: Tab[];

  constructor(private tabStore: TabStore) { }

  nzTabPosition: NzTabPosition = 'top';
  selectedIndex = 0;

  addTab() {
    this.tabStore.store.upsert({
      id: nanoid(),
      name: 'Untitled',
      sequence: 1,
      active: false,
    });
  }

  removeTab(event: { index: number }) {
    const tab = this.tabs[event.index];
    this.tabStore.store.remove(tab.id);
  }

  selectTab(tab: Tab) {
    const id = tab.id;
    this.tabStore.store.entities = this.tabStore.store.entities.map(tab => ({
      ...tab,
      active: tab.id === id
    }));
  }

  log(args: any[]): void {
    console.log(args);
  }
}
