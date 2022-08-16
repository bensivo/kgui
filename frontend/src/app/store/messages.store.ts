import { Injectable } from '@angular/core';
import { createStore, withProps } from '@ngneat/elf';
import { combineLatest } from 'rxjs';
import { ConsumerItem, ConsumerItemType } from '../pages/consumer/components/consumer-item/consumer-item.component';
import { SocketService } from '../socket/socket.service';
import { ConsumerStore } from './consumer.store';

export interface Message {
  ConsumerName: string;
  ClusterName: string;
  Topic: string;
  Partition: number;
  EOS: boolean;
  Message?: {
    Value: string;
  }
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
      this.socketService.stream<Message>('message.consumed')
    ])
      .subscribe(([consumers, message]) => {
        const consumerName = message.ConsumerName;
        const consumer = consumers[consumerName];
        if (!consumer) {
          console.error('Message for unknown consumer', consumerName);
          return;
        }

        const items = this.store.getValue()[consumerName] ?? [];
        let item: ConsumerItem | undefined;
        if (message.EOS) {
          item = {
            type: ConsumerItemType.INFO,
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
              type: ConsumerItemType.MESSAGE,
              data: value,
            }
            :
            {
              type: ConsumerItemType.INFO,
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
