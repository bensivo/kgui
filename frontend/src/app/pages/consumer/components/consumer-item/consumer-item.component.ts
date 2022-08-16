import { Component, Input } from '@angular/core';

export enum ConsumerItemType {
    MESSAGE = 'MESSAGE', // Message from kafka
    INFO = 'INFO', // Information for the user, not a message
}

export interface ConsumerItem {
    type: ConsumerItemType;
    data: string;
}

@Component({
  selector: 'app-consumer-item',
  templateUrl: './consumer-item.component.html',
  styleUrls: ['./consumer-item.component.less']
})
export class ConsumerItemComponent {
  ConsumerItemType = ConsumerItemType;

  @Input()
  item!: ConsumerItem
}
