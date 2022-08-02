import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddClusterComponent } from './components/add-cluster/add-cluster.component';
import { ClusterComponent } from './components/cluster/cluster.component';

const routes: Routes = [
  { path: '', component: ClusterComponent },
  { path: 'add', component: AddClusterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClusterRoutingModule { }
