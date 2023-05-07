import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavTreeModule } from 'src/app/components/nav-tree/nav-tree.module';
import { NgZorroModule } from 'src/app/ng-zorro/ng-zorro.module';
import { NavComponent } from './nav.component';

@NgModule({
  declarations: [
    NavComponent
  ],
  imports: [
    CommonModule,
    NavTreeModule,
    NgZorroModule,
    RouterModule,
  ],
  exports: [
    NavComponent
  ]
})
export class NavModule { }
