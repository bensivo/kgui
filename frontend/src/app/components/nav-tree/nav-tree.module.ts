import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NavTreeComponent } from './nav-tree.component';

import { ReactiveFormsModule } from '@angular/forms';
import { NgZorroModule } from 'src/app/ng-zorro/ng-zorro.module';

@NgModule({
  declarations: [
    NavTreeComponent
  ],
  imports: [
    CommonModule,
    NgZorroModule,
    ReactiveFormsModule,
  ],
  exports: [
    NavTreeComponent,
  ]
})
export class NavTreeModule { }
