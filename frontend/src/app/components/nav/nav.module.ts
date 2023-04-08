import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav.component';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NavTreeModule } from 'src/app/components/nav-tree/nav-tree.module';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationModule } from 'ng-zorro-antd/notification';

@NgModule({
  declarations: [
    NavComponent
  ],
  imports: [
    CommonModule,
    NavTreeModule,
    NzIconModule,
    NzMenuModule,
    NzModalModule,
    NzNotificationModule,
    RouterModule,
  ],
  exports: [
    NavComponent
  ]
})
export class NavModule { }
