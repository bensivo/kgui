import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/socket/socket.service';
import { ClusterState, ClusterStore } from 'src/app/store/cluster.store';

export interface Cluster {
  Name: string;
  BootstrapServer: string;
  SaslMechanism: string;
  SaslUsername: string;
  SaslPassword: string;
  SSLEnabled: boolean;
  SSLCaCertificatePath: string;
  SSLSkipVerification: boolean;
}

@Component({
  selector: 'app-cluster',
  templateUrl: './cluster.component.html',
  styleUrls: ['./cluster.component.less']
})
export class ClusterComponent implements OnInit {
  clusters: Cluster[] = [];

  constructor(private socketService: SocketService, private clusterStore: ClusterStore, private router: Router) { }

  async ngOnInit(): Promise<void> {
    this.clusterStore.store.subscribe((state: ClusterState) => {
      this.clusters = state.clusters
    });
  }
  
  addCluster() {
    this.router.navigate(['/clusters/add']);
  }

  editCluster(cluster: any) {
    this.router.navigate([`/clusters/add/${cluster.Name}`]);
  }

  deleteCluster(cluster: any) {
    this.socketService.send({
      Topic: 'clusters.remove',
      Data: cluster,
    });
  }
}
