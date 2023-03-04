import { Observable } from "rxjs";
import { Message } from "../emitter.service";

export interface Emitter {
    send<T>(msg: Message<T>): void;
    stream<T>(topic: string): Observable<T> ;
    initialize(): Promise<void>;
}