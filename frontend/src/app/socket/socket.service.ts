import { Injectable } from '@angular/core';
import { Subject, Observable,  } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export interface Message<T> {
  Topic: string;
  Data: T;
}

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private ws!: WebSocket;

  private messages = new Subject<Message<any>>()
  public $messages = this.messages.asObservable();

  async initialize() {
    await new Promise<void>((resolve, reject) => {
      this.ws = new WebSocket('ws://localhost:8080/connect');
      this.ws.addEventListener('open', () => {
        resolve();
      });

      this.ws.addEventListener('error', (e: any) => {
        console.error('Websocket error', e);
        reject();
      });

      this.ws.addEventListener('message', (m: MessageEvent) => {
        console.log(JSON.parse(m.data));
        this.messages.next(JSON.parse(m.data));
      });
    });
  }

  public get connected(): boolean {
    return this.ws.readyState === this.ws.OPEN;
  }

  public send<T>(msg: Message<T>) {
    console.log('Send', msg);
    if (!this.connected) {
      throw new Error('Cannot send message. Websocket closed');
    }

    this.ws.send(JSON.stringify(msg));
  }

  public stream<T>(topic: string): Observable<T> {
    return this.$messages.pipe(
      filter((m) => m.Topic === topic),
      map((m) => m.Data)
    );
  }
}
