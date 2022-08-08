import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { ConsumersComponent } from './components/consumers.component';
import { ConsumersRoutingModule } from './consumers-routing.module';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { MessageTreeComponent } from './components/message-tree/message-tree.component';


@NgModule({
  declarations: [
    ConsumersComponent,
    MessageTreeComponent,
  ],
  imports: [
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
  ]
})
export class ConsumersModule { }
