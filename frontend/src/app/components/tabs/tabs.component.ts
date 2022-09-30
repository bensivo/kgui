import { Component, Input, OnInit } from '@angular/core';
import { nanoid } from 'nanoid';
import { NzTabPosition } from 'ng-zorro-antd/tabs';
import { Tab, TabStore } from 'src/app/store/tab.store';


@Component({
  selector: 'app-tabs-component',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.less']
})
export class TabsComponent{
  @Input()
  tabs!: Tab[];

  @Input()
  selectedIndex!: number;

  constructor(private tabStore: TabStore) { }

  nzTabPosition: NzTabPosition = 'top';

  addTab() {
    // this.tabStore.store.upsert({
    //   id: nanoid(),
    //   name: 'Untitled' + this.tabs.length,
    //   active: false,
    // });
  }

  removeTab(event: { index: number }) {
    const tab = this.tabs[event.index];
    this.tabStore.store.remove(tab.id);
  }

  selectTab(tab: Tab) {
    const id = tab.id;
    this.tabStore.selectTab(id);
  }

  log(args: any[]): void {
    console.log(args);
  }
}
