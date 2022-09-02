import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { NavStore } from 'src/app/store/nav.store';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent {

  constructor(private navStore: NavStore) { }

  expanded$ = this.navStore.store.pipe(map(s => s.expanded))

  onClickToggleNav() {
    this.navStore.store.update(s => ({
      ...s,
      expanded: !s.expanded,
    }));
  }
}
