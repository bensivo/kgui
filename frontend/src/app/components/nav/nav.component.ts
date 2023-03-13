import { Component, ViewEncapsulation } from '@angular/core';
import { nanoid } from 'nanoid';
import { NavStore } from 'src/app/store/nav.store';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class NavComponent {
  constructor(
    private navStore: NavStore,
  ) { }

  isCollapsed = false;

  addFolder() {
    this.navStore.insertNode({
      id: nanoid(),
      name: 'Untitled',
      type: 'folder',
      children: [],
      expanded: false,
    })
  }
}
