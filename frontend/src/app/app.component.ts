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

  links = [
    {
      text: 'Clusters',
      route: '/clusters',
      icon: 'appstore',
    },
    {
      text: 'Consumers',
      route: '/consumers',
      icon: 'api',
    },
  ]

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
  }
}
