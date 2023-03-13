import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NzTabPosition } from 'ng-zorro-antd/tabs';
import { map } from 'rxjs/operators';
import { Cluster, ClusterStore } from 'src/app/store/cluster.store';
import { NavStore } from 'src/app/store/nav.store';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit{

  expanded$ = this.navStore.store.pipe(map(s => s.expanded))

  clusters$ = this.clusterStore.store.entities$;
  activeCluster$ = this.clusterStore.active$;

  activeClusterFormControl = new FormControl();

  tabs: Array<{ name: string; content: string; disabled: boolean }> = [];
  nzTabPosition: NzTabPosition = 'top';
  selectedIndex = 5;

  constructor(private navStore: NavStore, private clusterStore: ClusterStore) {}

  ngOnInit(): void {
    this.activeClusterFormControl.valueChanges.subscribe((cluster: Cluster) => {
      this.clusterStore.setActive(cluster);
    });

    this.activeCluster$.subscribe((active) => {
      if (active !== this.activeClusterFormControl.value) {
        this.activeClusterFormControl.setValue(active);
      }
    })
  }


  onClickToggleNav() {
    this.navStore.store.update(s => ({
      ...s,
      expanded: !s.expanded,
    }));
  }
}
