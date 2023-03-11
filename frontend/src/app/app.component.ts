import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { StorageService } from './storage/storage.service';
import { EmitterService } from './emitter/emitter.service';
import { ClusterState, ClusterStore } from './store/cluster.store';
import { MessagesStore } from './store/messages.store';
import { NavStore } from './store/nav.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  constructor(private navStore: NavStore, private emitterService: EmitterService, private clusterStore: ClusterStore, private storageService: StorageService, private messagesStore: MessagesStore) { }

  expanded$ = this.navStore.store.pipe(map(s => s.expanded));

  onExpandedChange(expanded: boolean) {
    this.navStore.store.update(s => ({
      ...s,
      expanded,
    }));
  }

  async ngOnInit() {
    await this.emitterService.emitter.initialize();
    await this.messagesStore.init();
    this.storageService.initialize();

    this.emitterService.emitter.stream<any[]>('clusters.changed')
      .subscribe((clusters: any[]) => {
        let active = this.clusterStore.state.active;
        if (!active && clusters.length > 0) {
          active = clusters[0];
        }
        this.clusterStore.store.update((_state: ClusterState) => ({
          clusters,
          active,
        }));
      });

    this.emitterService.emitter.send({
      Topic: 'clusters.refresh',
      Data: {},
    });
  }
}
