import { Injectable } from '@angular/core';
import { createStore, withProps } from '@ngneat/elf';
import { combineLatest } from 'rxjs';
import { SocketService } from '../socket/socket.service';
import { ConsumerStore } from './consumer.store';

export interface KafkaMessage {
  ConsumerName: string;
  ClusterName: string;
  Topic: string;
  Partition: number;
  EOS: boolean;
  Message?: {
    Value: string;
  }
}

export enum MessageType {
  MESSAGE = 'MESSAGE', // Message from kafka
  INFO = 'INFO', // Information for the user, not a message
}

export interface Message {
  type: MessageType;
  data: string;
}

export interface MessagesState {
  [consumerName: string]: any[];
}

@Injectable({
  providedIn: 'root'
})
export class MessagesStore {
  constructor(
    private socketService: SocketService,
    private consumerStore: ConsumerStore,
  ) {
    this.init();
  }

  store = createStore({
    name: 'messages'
  }, withProps<MessagesState>({}));


  init() {
    combineLatest([
      this.consumerStore.store,
      this.socketService.stream<KafkaMessage>('message.consumed')
    ])
      .subscribe(([consumers, message]) => {
        const consumerName = message.ConsumerName;
        const consumer = consumers[consumerName];
        if (!consumer) {
          console.error('Message for unknown consumer', consumerName);
          return;
        }

        const items = this.store.getValue()[consumerName] ?? [];
        let item: Message | undefined;
        if (message.EOS) {
          item = {
            type: MessageType.INFO,
            data: 'End of Topic'
          };
        }

        if (!item && !message.Message) {
          console.error('No value', message)
          return;
        }

        if (!item && message.Message) {
          const value = atob(message.Message.Value);
          item = this.passesFilter(value, consumer.filters) ?
            {
              type: MessageType.MESSAGE,
              data: value,
            }
            :
            {
              type: MessageType.INFO,
              data: '...',
            };
        }

        items.push(item);
        this.store.update((state) => ({
          ...state,
          [consumerName]: [...items]
        }));
      })
  }

  private passesFilter(value: string, filters: string[]) {
    for (const filter of filters) {
      if (!value.includes(filter)) {
        return false;
      }
    }

    return true;
  }
}
