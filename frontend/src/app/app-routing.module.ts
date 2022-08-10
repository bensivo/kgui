import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/clusters' },
  { path: 'clusters', loadChildren: () => import('./pages/cluster/cluster.module').then(m => m.ClusterModule) },
  { path: 'consumers', loadChildren: () => import('./pages/consumer/consumer.module').then(m => m.ConsumerModule) },
  { path: 'producers', loadChildren: () => import('./pages/producer/producer.module').then(m => m.ProducerModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
