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
import { MessageJsonComponent } from './message-json/message-json.component';
import { MessageRawComponent } from './message-raw/message-raw.component';
import { MessageTreeComponent } from './message-tree/message-tree.component';
import { MessageComponent } from './message.component';

@NgModule({
  declarations: [
    MessageComponent, MessageJsonComponent, MessageTreeComponent, MessageRawComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzSelectModule,
    NzTreeViewModule,
    NzIconModule,
    NzTreeModule,
    NzInputModule,
    NzInputNumberModule,
    NzButtonModule,
    NzMenuModule,
  ],
  exports: [
    MessageComponent,
  ],
})
export class MessageModule { }
