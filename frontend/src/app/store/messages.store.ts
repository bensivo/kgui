import { Injectable } from '@angular/core';
import { createStore, select, withProps } from '@ngneat/elf';
import { combineLatest, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { SocketService } from '../socket/socket.service';
import { Consumer, ConsumerStore } from './consumer.store';

export interface KafkaMessage {
  ConsumerId: string;
  ClusterName: string;
  Topic: string;
  Partition: number;
  EOS: boolean;
  Message?: {
    Value: string;
  }
}

export enum MessageType {
  MESSAGE = 'MESSAGE',
  EOS = 'EOS',
  SKIP = 'SKIP',
}

export interface Message {
  type: MessageType;
  data: string | number;
}

export interface MessagesState {
  [consumerId: string]: any[];
}

@Injectable({
  providedIn: 'root'
})
export class MessagesStore {
  constructor(
    private socketService: SocketService,
  ) {
    this.init();
  }

  store = createStore({
    name: 'messages'
  }, withProps<MessagesState>({}));

  init() {
    combineLatest([
      this.socketService.stream<KafkaMessage>('message.consumed')
    ])
      .subscribe(([message]) => {
        const consumerId = message.ConsumerId;

        if (message.EOS) {
          this.pushMessage(consumerId, {
            type: MessageType.EOS,
            data: 'End of Topic'
          })
          return;
        }

        if (message.Message) {
          const value = atob(message.Message.Value);
          this.pushMessage(consumerId, {
            type: MessageType.MESSAGE,
            data: value,
          });
          return;
        }

        console.warn('Received message with no data', message)
      })
  }

  pushMessage(consumerId: string, message: Message) {
    const state = this.store.getValue()
    const messages = state[consumerId] ?? [];
    messages.push(message);
    this.store.update(() => ({
      ...state,
      [consumerId]: messages
    }));
  }

  forConsumer(consumer$: Observable<Consumer>): Observable<Message[]> {
    return combineLatest([
      consumer$,
      this.store,
    ]).pipe(
      map(([consumer, state]) => {
        const messages = state[consumer.id] ?? [];
        const filterFunctions = consumer.filters.map(filterString => (text: string) => {
          return text.includes(filterString)
        });

        // Run all messages through filter.
        // Any message that doesn't pass all filters gets replaced with a SKIP message
        for (let i = 0; i < messages.length; i++) {
          const message = messages[i];

          if (message.type !== MessageType.MESSAGE) {
            continue;
          }

          const failsAny = filterFunctions.some((filterFn) => !filterFn('' + message.data));
          if (failsAny) {
            messages[i] = {
              type: MessageType.SKIP,
              data: 1,
            }
          }
        }
        return messages;
      }),
      map((messages) => {
        // Replace series of Skipped messages with a single message that says 'skipped n'
        const filteredMessages = [];
        for (let i = 0; i < messages.length; i++) {
          const message = messages[i];
          if (message.type !== MessageType.SKIP) {
            filteredMessages.push({ ...message });
            continue;
          }

          if (messages[i - 1]?.type === MessageType.SKIP) {
            (filteredMessages[filteredMessages.length - 1].data as number) += 1;
            continue;
          }

          filteredMessages.push({ ...message });
        }
        return filteredMessages;
      }),
    )
  }


}
