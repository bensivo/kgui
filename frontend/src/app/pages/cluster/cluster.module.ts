import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { ClusterRoutingModule } from './cluster-routing.module';
import { AddClusterComponent } from './components/add-cluster/add-cluster.component';
import { ClusterComponent } from './components/cluster/cluster.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AddClusterContainer } from './components/add-cluster/add-cluster.container';

@NgModule({
  declarations: [
    ClusterComponent,
    AddClusterComponent,
    AddClusterContainer
  ],
  imports: [
    ClusterRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    NzCardModule,
    NzFormModule,
    NzCheckboxModule,
    NzSelectModule,
    NzButtonModule,
    NzInputModule,
    NzSpaceModule,
    NzIconModule,
  ]
})
export class ClusterModule { }
