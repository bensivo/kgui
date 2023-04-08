import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddClusterContainer } from './components/add-cluster/add-cluster.container';
import { ClusterComponent } from './components/cluster/cluster.component';
import { TabContentContainer } from './components/tab-content/tabs.container';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/clusters' },
  {
    path: 'clusters',
    children: [
      {
        path: '',
        component: ClusterComponent,
      },
      {
        path: 'add',
        component: AddClusterContainer,
      },
      {
        path: 'edit/:id',
        component: AddClusterContainer,
      },
    ]
  },
  { 
    path: 'workspace' ,
    component: TabContentContainer,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
