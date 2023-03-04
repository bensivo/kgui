import { Observable, Subject } from "rxjs";
import { EventsEmit, EventsOn } from "wailsjs/runtime/runtime";
import { Message } from "./emitter.service";
import { Emitter } from "./interface/emitter.interface";

export class EventsEmitter implements Emitter {
    send<T>(msg: Message<T>): void {
        EventsEmit(msg.Topic, msg.Data);
    }

    stream<T>(topic: string): Observable<T> {
        const sub = new Subject<T>();
        EventsOn(topic, (data: T) => {
            sub.next(data);
        })

        return sub.asObservable();
    }

    // This setup doesn't need to be initialized
    initialize(): Promise<void> {
        if (!(window as any).runtime) {
            return Promise.reject(new Error('Wails runtime is not available. Are you you running in a desktop wails environment?'));
        }
        return Promise.resolve();
    }

}