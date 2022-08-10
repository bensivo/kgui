import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProducersRoutingModule } from './producer-routing.module';
import { ProducerComponent } from './components/producer/producer.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { ConsumersRoutingModule } from '../consumer/consumer-routing.module';



@NgModule({
  declarations: [
    ProducerComponent
  ],
  imports: [
    ProducersRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ConsumersRoutingModule,
    NzSelectModule,
    NzTreeViewModule,
    NzIconModule,
    NzTreeModule,
    NzInputModule,
    NzInputNumberModule,
    NzMenuModule,
  ]
})
export class ProducerModule { }
