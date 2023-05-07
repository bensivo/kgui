import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddClusterContainer } from './components/add-cluster/add-cluster.container';
import { ClusterComponent } from './components/cluster/cluster.component';
import { TabContentContainer } from './components/tab-content/tabs.container';
import { WorkspacesComponent } from './components/workspaces/workspaces.component';
import { LayoutFullscreenComponent } from './layout/layout-fullscreen/layout-fullscreen.component';
import { LayoutWithSidebarComponent } from './layout/layout-with-sidebar/layout-with-sidebar.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/workspaces' },
  {
    path: '',
    component: LayoutFullscreenComponent,
    children: [
      {
        path: 'workspaces',
        component: WorkspacesComponent,
      }
    ]
  },
  {
    path: '',
    component: LayoutWithSidebarComponent,
    children: [
      {
        path: 'clusters',
        component: ClusterComponent,
      },
      {
        path: 'clusters/add',
        component: AddClusterContainer,
      },
      {
        path: 'clusters/edit/;id',
        component: AddClusterContainer,
      },
      {
        path: 'workspace',
        pathMatch: 'full',
        component: TabContentContainer,
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
