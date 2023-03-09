import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/clusters' },
  { path: 'clusters', loadChildren: () => import('./pages/cluster/cluster.module').then(m => m.ClusterModule) },
  { path: 'workspace', loadChildren: () => import('./pages/workspace/workspace.module').then(m => m.WorkspaceModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
