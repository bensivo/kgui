import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsumerContainer } from './components/consumer/consumer.container';

const routes: Routes = [
  { path: ':id', component: ConsumerContainer },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsumersRoutingModule { }
