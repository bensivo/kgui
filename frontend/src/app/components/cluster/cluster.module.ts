import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgZorroModule } from 'src/app/ng-zorro/ng-zorro.module';
import { ClusterComponent } from './cluster.component';

@NgModule({
  declarations: [
    ClusterComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgZorroModule,
  ],
  exports: [
    ClusterComponent,
  ],
})
export class ClusterModule { }
