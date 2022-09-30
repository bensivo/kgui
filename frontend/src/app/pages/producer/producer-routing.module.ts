import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProducerContainer } from './components/producer-view/producer.container';

const routes: Routes = [
  { path: ':id', component: ProducerContainer },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProducersRoutingModule { }
