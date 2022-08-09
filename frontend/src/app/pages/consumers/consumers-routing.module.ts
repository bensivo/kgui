import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsumersComponent } from './components/consumers.component';

const routes: Routes = [
  { path: ':name', component: ConsumersComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsumersRoutingModule { }
