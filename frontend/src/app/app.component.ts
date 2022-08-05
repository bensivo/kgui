import { Component, OnInit } from '@angular/core';
import { SocketService } from './socket/socket.service';
import { ClusterState, ClusterStore } from './store/cluster.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  isCollapsed = false;

  constructor(private socketService: SocketService, private clusterStore: ClusterStore) { }

  async ngOnInit() {
    await this.socketService.initialize();

    this.socketService.stream<any[]>('clusters.changed')
      .subscribe((clusters: any[]) => {
        console.log('New Clusters', clusters);
        this.clusterStore.store.update((_state: ClusterState) => ({
          clusters,
        }))
      });
  }
}
