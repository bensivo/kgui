import { Injectable } from '@angular/core';
import { createStore, withProps } from '@ngneat/elf';
import { combineLatest } from 'rxjs';
import { SocketService } from '../socket/socket.service';
import { ConsumerStore } from './consumer.store';

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
      this.socketService.stream<any>('message.consumed')
    ])

    .subscribe(([consumers, message]) => {
        const consumerName = message.ConsumerName;
        const consumer = consumers[consumerName];
        if (!consumer) {
          console.error('Message for unknown consumer', consumerName);
        }

        const newMsg = atob(message.Message.Value);


        const allMsgs = this.store.getValue()[consumerName] ?? [];
        allMsgs.push(newMsg);
        this.store.update((state) => ({
          ...state,
          [consumerName]: allMsgs
        }))
    })
  }
}
