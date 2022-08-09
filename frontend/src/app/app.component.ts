import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SocketService } from './socket/socket.service';
import { ClusterState, ClusterStore } from './store/cluster.store';
import { ConsumerStore } from './store/consumer.store';
import { select } from '@ngneat/elf';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  isCollapsed = false;

  consumers$: Observable<any[]> = this.consumerStore.store.pipe(
    select((consumers) => Object.values(consumers))
  );

  constructor(private socketService: SocketService, private clusterStore: ClusterStore, private consumerStore: ConsumerStore) { }

  async ngOnInit() {
    await this.socketService.initialize();

    this.socketService.stream<any[]>('clusters.changed')
      .subscribe((clusters: any[]) => {
        console.log('New Clusters', clusters);
        this.clusterStore.store.update((_state: ClusterState) => ({
          clusters,
        }))
      });

    this.socketService.send({
      Topic: 'clusters.refresh',
      Data: null,
    });

    this.seed();
  }

  seed() {
    this.socketService.send({
      Topic: 'clusters.add',
      Data: {
        Name: "localhost",
        BootstrapServer: "localhost:9092",
        SaslMechanism: "",
        SaslUsername: "",
        SaslPassword: "",
        SSLEnabled: false,
        SSLCaCertificatePath: "",
        SSLSkipVerification: false,
      },
    });

    this.consumerStore.store.update((_s) => ({
      Logs: {
        name: 'Logs',
        topic: 'logs',
        offset: -1,

        messages: [],
      },
      Messages: {
        name: 'Messages',
        topic: 'messages',
        offset: 0,

        messages: [],
      }
    }));
  }
}
