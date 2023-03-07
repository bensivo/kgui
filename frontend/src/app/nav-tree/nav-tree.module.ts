import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavTreeComponent } from './nav-tree.component';

import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzContextMenuServiceModule, NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';

@NgModule({
  declarations: [
    NavTreeComponent
  ],
  imports: [
    CommonModule,
    NzTreeModule,
    NzDropDownModule,
    NzMenuModule,
    NzContextMenuServiceModule,
    NzModalModule,
    NzInputModule,
    ReactiveFormsModule,
  ],
  exports: [
    NavTreeComponent,
  ]
})
export class NavTreeModule { }
