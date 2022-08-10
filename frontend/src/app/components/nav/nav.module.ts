import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav.component';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';

@NgModule({
  declarations: [
    NavComponent
  ],
  imports: [
    CommonModule,
    NzMenuModule,
    RouterModule,
    NzIconModule,
  ],
  exports: [
    NavComponent
  ]
})
export class NavModule { }
