import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { NavStore } from 'src/app/store/nav.store';

@Component({
  selector: 'app-layout-with-sidebar',
  templateUrl: './layout-with-sidebar.component.html',
  styleUrls: ['./layout-with-sidebar.component.less']
})
export class LayoutWithSidebarComponent {

  constructor(private navStore: NavStore) { }

  expanded$ = this.navStore.store.pipe(map(s => s.expanded));

  onExpandedChange(expanded: boolean) {
    this.navStore.store.update(s => ({
      ...s,
      expanded,
    }));
  }


}
