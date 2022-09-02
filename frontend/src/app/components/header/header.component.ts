import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { select } from '@ngneat/elf';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cluster, ClusterStore } from 'src/app/store/cluster.store';
import { NavStore } from 'src/app/store/nav.store';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit{

  expanded$ = this.navStore.store.pipe(map(s => s.expanded))
  clusters$: Observable<Cluster[]> = this.clusterStore.store.pipe(
    select(s => s.clusters)
  );
  cluster = new FormControl();

  constructor(private navStore: NavStore, private clusterStore: ClusterStore) {}

  ngOnInit(): void {
    this.cluster.valueChanges.subscribe((cluster: Cluster) => {
      this.clusterStore.store.update(state => ({
        ...state,
        active: cluster,
      }));
    });
    
  }

  onClickToggleNav() {
    this.navStore.store.update(s => ({
      ...s,
      expanded: !s.expanded,
    }));
  }
}
