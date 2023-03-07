import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav.component';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NavTreeModule } from 'src/app/nav-tree/nav-tree.module';

@NgModule({
  declarations: [
    NavComponent
  ],
  imports: [
    CommonModule,
    NzMenuModule,
    RouterModule,
    NzIconModule,
    NavTreeModule,
  ],
  exports: [
    NavComponent
  ]
})
export class NavModule { }
