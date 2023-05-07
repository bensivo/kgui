import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroModule } from 'src/app/ng-zorro/ng-zorro.module';
import { MessageModule } from '../message/message.module';
import { ConsumerComponent } from './consumer.component';
import { ConsumerContainer } from './consumer.container';

@NgModule({
  declarations: [
    ConsumerContainer,
    ConsumerComponent,
  ],
  imports: [
    CommonModule,
    ScrollingModule,
    ReactiveFormsModule,
    MessageModule,
    FormsModule,
    NgZorroModule,
  ],
  exports: [
    ConsumerContainer,
  ],
})
export class ConsumerModule { }
