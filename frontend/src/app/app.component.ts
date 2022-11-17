import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { StorageService } from './storage/storage.service';
import { SocketService } from './socket/socket.service';
import { ClusterState, ClusterStore } from './store/cluster.store';
import { MessagesStore } from './store/messages.store';
import { NavStore } from './store/nav.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  constructor(private navStore: NavStore, private socketService: SocketService, private clusterStore: ClusterStore, private storageService: StorageService, private messagesStore: MessagesStore) { }

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
        let active = this.clusterStore.state.active;
        if (!active && clusters.length > 0) {
          active = clusters[0];
        }
        this.clusterStore.store.update((_state: ClusterState) => ({
          clusters,
          active,
        }));
      });

    this.socketService.send({
      Topic: 'clusters.refresh',
      Data: {},
    });

    //  SEEDS for local testing

    this.storageService.load({
      cluster: {
        clusters: [],
      },
      consumer: [
        {
          id: 'asdf',
          name: 'asdf',
          topic: 'asdf',
          offset: -500,
          follow: false,
          filters: []
        }
      ],
      producer: [
        {
          id: 'numbers',
          name: 'numbers',
          topic: 'numbers',
          partition: 0,
          message: new Date().toISOString(),
        }
      ]
    });

     this.socketService.send({
      Topic: 'clusters.add',
      Data: {
        BootstrapServer: "localhost:9092",
        Name: "localhost",
        SSLCaCertificatePath: "",
        SSLEnabled: false,
        SSLSkipVerification: false,
        SaslMechanism: "",
        SaslPassword: "",
        SaslUsername: "",
      },
    });

    this.socketService.send({
      Topic: 'clusters.add',
      Data: {
        BootstrapServer: "bad:9092",
        Name: "bad",
        SSLCaCertificatePath: "",
        SSLEnabled: false,
        SSLSkipVerification: false,
        SaslMechanism: "",
        SaslPassword: "",
        SaslUsername: "",
      },
    });
  }
}
