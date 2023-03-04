import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { EventsEmitter } from './events-emitter';
import { Emitter } from './interface/emitter.interface';
import { WebsocketEmitter } from './websocket-emitter';


export interface Message<T> {
  Topic: string;
  Data: T;
}

@Injectable({
  providedIn: 'root'
})
export class EmitterService {

  _emitter: Emitter;

  constructor(notification: NzNotificationService){

    if (!!(window as any).runtime) {
      this._emitter = new EventsEmitter();
    } else {
      this._emitter = new WebsocketEmitter(notification);
    }
  }

  get emitter() {
    return this._emitter
  }
}
