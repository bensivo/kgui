import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { ConsumerContainer } from './consumer.container';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ConsumerComponent } from './consumer.component';
import { MessageModule } from '../message/message.module';

@NgModule({
  declarations: [
    ConsumerContainer,
    ConsumerComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MessageModule,
    FormsModule,
    NzSelectModule,
    NzTreeViewModule,
    NzIconModule,
    NzTreeModule,
    NzInputModule,
    NzInputNumberModule,
    NzButtonModule,
    NzSwitchModule,
    NzMenuModule,
  ],
  exports: [
    ConsumerContainer,
  ],
})
export class ConsumerModule { }
