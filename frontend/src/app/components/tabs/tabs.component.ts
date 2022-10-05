import { Component, Input, ViewEncapsulation } from '@angular/core';
import { NzTabPosition } from 'ng-zorro-antd/tabs';
import { TabStore } from 'src/app/store/tab.store';
import { TabData } from './tabs.container';


@Component({
  selector: 'app-tabs-component',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class TabsComponent{
  @Input()
  tabs!: TabData[];

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

  selectTab(tab: TabData) {
    const id = tab.id;
    this.tabStore.selectTab(id);
  }

  log(args: any[]): void {
    console.log(args);
  }
}
