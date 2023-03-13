import { NzNotificationService } from "ng-zorro-antd/notification";
import { Observable, Subject } from "rxjs";
import { filter, map } from "rxjs/operators";
import { Emitter } from "./interface/emitter.interface";

export interface Message<T = any> {
    Topic: string;
    Data: T;
}

export class WebsocketEmitter implements Emitter {
    private ws!: WebSocket;

    constructor(private notification: NzNotificationService){}

    private messages = new Subject<Message>()
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

            this.ws.addEventListener('close', (e: any) => {
                console.error('Websocket error', e);
                this.notification.create('error', 'Error', 'Websocket connection closed');

                setTimeout(() => {
                    this.initialize();
                }, 5000)
            });

            this.ws.addEventListener('message', (m: MessageEvent) => {
                console.log('Receive', JSON.parse(m.data));
                this.messages.next(JSON.parse(m.data));
            });
        });

        this.stream('error')
            .subscribe((data: any) => {
                this.notification.create('error', 'Error', data.Message)
            })
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