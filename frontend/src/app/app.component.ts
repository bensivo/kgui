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
        this.clusterStore.store.update((_state: ClusterState) => ({
          clusters,
        }))
      });

    // this.storageService.load({
    //   cluster: {
    //     clusters: [],
    //   },
    //   consumer: {
    //     ['numbers']: {
    //       id: 'numbers',
    //       name: 'numbers',
    //       topic: 'numbers',
    //       offset: 0,
    //       filters: []
    //     },
    //     ['asdf']: {
    //       id: 'asdf',
    //       name: 'event stream',
    //       topic: 'deming.event.stream',
    //       offset: -1,
    //       filters: []
    //     }
    //   },
    //   producer: {},
    // });



    //  this.socketService.send({
    //   Topic: 'clusters.add',
    //   Data: {
    //     BootstrapServer: "localhost:9092",
    //     Name: "localhost",
    //     SSLCaCertificatePath: "",
    //     SSLEnabled: false,
    //     SSLSkipVerification: false,
    //     SaslMechanism: "",
    //     SaslPassword: "",
    //     SaslUsername: "",
    //   },
    // });
  }
}
