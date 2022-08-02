import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private socketService: SocketService, private router: Router) { }

  async ngOnInit(): Promise<void> {
    this.socketService.stream<Cluster[]>('res.clusters.add').subscribe(m => {
      this.clusters = m.Data;
    });
  }
  
  addCluster() {
    this.router.navigate(['/clusters/add']);
  }
}
