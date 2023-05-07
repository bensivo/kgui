import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroModule } from 'src/app/ng-zorro/ng-zorro.module';
import { MessageJsonComponent } from './message-json/message-json.component';
import { MessageRawComponent } from './message-raw/message-raw.component';
import { MessageTreeComponent } from './message-tree/message-tree.component';
import { MessageComponent } from './message.component';

@NgModule({
  declarations: [
    MessageComponent, MessageJsonComponent, MessageTreeComponent, MessageRawComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgZorroModule,
  ],
  exports: [
    MessageComponent,
  ],
})
export class MessageModule { }
