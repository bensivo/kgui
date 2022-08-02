import { Component, OnInit } from '@angular/core';
import { Message, SocketService } from 'src/app/socket/socket.service';

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

  constructor(private socketService: SocketService) { }

  async ngOnInit(): Promise<void> {
    this.socketService.stream<Cluster[]>('res.clusters.add').subscribe(m => {
      this.clusters = m.Data;
    });
  }
  
  addCluster() {
    this.clusters.push({
      Name: "cluster" + (this.clusters.length + 1),
      BootstrapServer: "localhost:9092",
      SaslMechanism: "",
      SaslUsername: "",
      SaslPassword: "",
      SSLEnabled: false,
      SSLCaCertificatePath: "",
      SSLSkipVerification: true,
    });
  }
}
