import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { ConsumerComponent } from './components/consumer/consumer.component';
import { ConsumersRoutingModule } from './consumer-routing.module';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { ConsumerViewComponent } from './components/consumer-view/consumer-view.component';
import { MessageComponent } from './components/message/message.component';
import { NzButtonModule } from 'ng-zorro-antd/button';


@NgModule({
  declarations: [
    ConsumerComponent,
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
