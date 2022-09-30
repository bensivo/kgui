import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { ConsumersRoutingModule } from '../consumer/consumer-routing.module';
import { ProducerViewComponent } from './components/producer-view/producer-view.component';
import { ProducerContainer } from './components/producer-view/producer.container';
import { ProducersRoutingModule } from './producer-routing.module';



@NgModule({
  declarations: [
    ProducerContainer,
    ProducerViewComponent,
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
    NzButtonModule,
  ],
  exports: [
    ProducerContainer,
  ]
})
export class ProducerModule { }
