import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { ConsumerContainer } from './components/consumer/consumer.container';
import { ConsumersRoutingModule } from './consumer-routing.module';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { MessageComponent } from './components/message/message.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ConsumerViewComponent } from './components/consumer/consumer.component';

@NgModule({
  declarations: [
    ConsumerContainer,
    ConsumerViewComponent,
    MessageComponent,
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
    NzButtonModule,
    NzMenuModule,
  ]
})
export class ConsumerModule { }
