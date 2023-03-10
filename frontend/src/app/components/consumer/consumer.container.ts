import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { select } from '@ngneat/elf';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, sampleTime } from 'rxjs/operators';
import { Cluster, ClusterStore } from 'src/app/store/cluster.store';
import { Consumer, ConsumerStore } from 'src/app/store/consumer.store';
import { Message, MessagesStore } from 'src/app/store/messages.store';

@Component({
  selector: 'app-consumer',
  template: `
    <app-consumer-view *ngIf="data$ | async as data" [cluster]="data.cluster" [consumer]="data.consumer" [messages]="data.messages" [formGroup]="data.formGroup"></app-consumer-view>
  `,
  styles: [`
    .app-consumer-view {
      height: 100%;
    }
  `]
})
export class ConsumerContainer implements OnChanges {

  @Input()
  consumerId!: string;

  consumerId$ = new BehaviorSubject(this.consumerId);
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.consumerId) {
      this.consumerId$.next(changes.consumerId.currentValue);
    }
  }

  constructor(
    private clusterStore: ClusterStore,
    private consumerStore: ConsumerStore,
    private messagesStore: MessagesStore,
    private formBuilder: FormBuilder,
  ) { }

  cluster$: Observable<Cluster | undefined> = this.clusterStore.store.pipe(
    select(s => s.active)
  );

  consumer$: Observable<Consumer> = combineLatest([this.consumerId$, this.consumerStore.store.entities$]).pipe(
    map(([consumerId, consumers]) => {
      const consumer = consumers.find(c => c.id === consumerId)
      if (!consumer) {
        console.error('Cannot find consumer with id', consumerId);
      }
      return consumer as Consumer;
    })
  )

  startTime?: number;

  messages$: Observable<Message[]> = this.messagesStore.forConsumer(this.consumer$)
    .pipe(sampleTime(100)); // Messages only update every 100ms, to reduce the number of re-renders when messages are flowing in very fast.

  data$ = combineLatest([
    this.cluster$,
    this.consumer$,
    this.messages$,
  ]).pipe(
    map(([cluster, consumer, messages]) => {
      const formGroup: FormGroup = this.formBuilder.group({
        topic: new FormControl(consumer.topic),
        partition: new FormControl(0),
        offset: new FormControl(consumer.offset),
        follow: new FormControl(consumer.follow),
        filters: new FormArray(consumer.filters.map(filter => new FormControl(filter)))
      })

      formGroup.valueChanges.subscribe((value) => {
        this.consumerStore.store.update(consumer.id, {
          topic: value.topic,
          offset: value.offset,
          follow: value.follow,
          filters: value.filters,
        });
      });

      return {
        cluster,
        consumer,
        formGroup,
        messages,
      }
    })
  )
}
