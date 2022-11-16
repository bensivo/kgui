import { Component, Input, OnInit } from '@angular/core';
import { Message } from 'src/app/store/messages.store';

@Component({
  selector: 'app-message-raw',
  templateUrl: './message-raw.component.html',
  styleUrls: ['./message-raw.component.less']
})
export class MessageRawComponent {
  @Input()
  message!: Message;

  get timestamp() {
    return new Date(this.message.time).toLocaleString();
  }

}
