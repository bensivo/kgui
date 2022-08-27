import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from './services/storage.service';
import { SocketService } from './socket/socket.service';
import { ClusterState, ClusterStore } from './store/cluster.store';
import { ConsumerStore } from './store/consumer.store';
import { ProducerStore } from './store/producer.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  isCollapsed = false;

  consumers$: Observable<any[]> = this.consumerStore.consumers$;

  constructor(private socketService: SocketService, private clusterStore: ClusterStore, private consumerStore: ConsumerStore, private producerStore: ProducerStore, private storageService: StorageService) { }

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
