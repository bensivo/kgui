import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { EmitterService } from 'src/app/emitter/emitter.service';
import { Cluster, ClusterStore } from 'src/app/store/cluster.store';

@Component({
  selector: 'app-cluster',
  templateUrl: './cluster.component.html',
  styleUrls: ['./cluster.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class ClusterComponent{

  constructor(private emitterService: EmitterService, private clusterStore: ClusterStore, private router: Router) { }

  clusters$ = this.clusterStore.store.entities$;
  
  addCluster() {
    this.router.navigate(['/clusters/add']);
  }

  editCluster(cluster: any) {
    this.router.navigate([`/clusters/edit/${cluster.id}`]);
  }

  deleteCluster(cluster: Cluster) {
    this.clusterStore.store.remove(cluster.id);
  }
}
