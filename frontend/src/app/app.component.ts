import { Component, OnInit } from '@angular/core';
import { select } from '@ngneat/elf';
import { map } from 'rxjs/operators';
import { StorageService } from './services/storage.service';
import { SocketService } from './socket/socket.service';
import { ClusterState, ClusterStore } from './store/cluster.store';
import { NavStore } from './store/nav.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  constructor(private navStore: NavStore, private socketService: SocketService, private clusterStore: ClusterStore, private storageService: StorageService) { }

  expanded$ = this.navStore.store.pipe(map(s => s.expanded));

  onExpandedChange(expanded: boolean) {
    this.navStore.store.update(s => ({
      ...s,
      expanded,
    }));
  }

  async ngOnInit() {
    await this.socketService.initialize();
    this.storageService.initialize();

    this.socketService.stream<any[]>('clusters.changed')
      .subscribe((clusters: any[]) => {
        this.clusterStore.store.update((_state: ClusterState) => ({
          clusters,
        }))
      });

    this.socketService.send({
      Topic: 'clusters.refresh',
      Data: null,
    });
  }
}
