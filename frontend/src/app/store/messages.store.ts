import { Injectable } from '@angular/core';
import { createStore, withProps } from '@ngneat/elf';
import { SocketService } from '../socket/socket.service';

export interface MessagesState {
  [consumerName: string]: any[];
}

@Injectable({
  providedIn: 'root'
})
export class MessagesStore {
  constructor(private socketService: SocketService) {
    this.init();
  }

  store = createStore({
    name: 'messages'
  }, withProps<MessagesState>({}));


  init() {
    this.socketService.stream<any>('message.consumed')
      .subscribe((message: any) => {
        const consumerName = message.ConsumerName;
        const newMsg = atob(message.Message.Value);
        const allMsgs = this.store.getValue()[consumerName] ?? [];
        allMsgs.push(newMsg);

        this.store.update((state) => ({
          ...state,
          [consumerName]: allMsgs
        }))
      });
  }
}
