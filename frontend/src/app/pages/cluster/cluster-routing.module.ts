import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddClusterContainer } from './components/add-cluster/add-cluster.container';
import { ClusterComponent } from './components/cluster/cluster.component';

const routes: Routes = [
  { path: '', component: ClusterComponent },
  { path: 'add', component: AddClusterContainer },
  { path: 'add/:name', component: AddClusterContainer },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClusterRoutingModule { }
