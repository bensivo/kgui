import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgZorroModule } from 'src/app/ng-zorro/ng-zorro.module';
import { AddClusterComponent } from './add-cluster.component';
import { AddClusterContainer } from './add-cluster.container';

@NgModule({
  declarations: [
    AddClusterContainer,
    AddClusterComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgZorroModule,
    
  ],
  exports: [
    AddClusterContainer,
  ],
})
export class AddClusterModule { }
