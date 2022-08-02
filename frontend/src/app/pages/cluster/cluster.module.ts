import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { ClusterRoutingModule } from './cluster-routing.module';
import { ClusterComponent } from './cluster.component';



@NgModule({
  declarations: [
    ClusterComponent
  ],
  imports: [
    ClusterRoutingModule,
    CommonModule,
    NzCardModule,
  ]
})
export class ClusterModule { }
