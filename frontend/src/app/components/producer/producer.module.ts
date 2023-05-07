import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroModule } from 'src/app/ng-zorro/ng-zorro.module';
import { ProducerViewComponent } from './producer.component';
import { ProducerContainer } from './producer.container';



@NgModule({
  declarations: [
    ProducerContainer,
    ProducerViewComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgZorroModule,
  ],
  exports: [
    ProducerContainer,
  ]
})
export class ProducerModule { }
