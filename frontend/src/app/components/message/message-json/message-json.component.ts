import { Component, Input, OnInit } from '@angular/core';
import { Message } from 'src/app/store/messages.store';

@Component({
  selector: 'app-message-json',
  templateUrl: './message-json.component.html',
  styleUrls: ['./message-json.component.less']
})
export class MessageJsonComponent {

  @Input()
  message!: Message;

  get timestamp() {
    return new Date(this.message.time).toLocaleString();
  }

  get messageAsJson() {
    try {
      return JSON.parse(''+this.message.data)
    } catch (e) {
      return this.message.data
    }
  }
}
