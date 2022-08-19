import { Component, Input } from '@angular/core';
import { Message, MessageType } from 'src/app/store/messages.store';



@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.less']
})
export class MessageComponent {
  MessageType = MessageType;

  @Input()
  message!: Message
}
