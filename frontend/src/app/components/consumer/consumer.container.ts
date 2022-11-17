import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select } from '@ngneat/elf';
import { BehaviorSubject, combineLatest, interval, Observable, Subject, zip } from 'rxjs';
import { auditTime, defaultIfEmpty, last, map, observeOn, sampleTime, takeLast, tap, throttleTime } from 'rxjs/operators';
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
        console.error('Cannot find consumer with id', consumerId)
      }
      return consumer as Consumer;
    })
  )

  startTime?: number;

  messages$: Observable<Message[]> = this.messagesStore.forConsumer(this.consumer$)
  .pipe(
    // throttleTime(200),
    sampleTime(100),
    // map((messages) => {
    //   return messages.slice(-100);
    // }),
    // tap((m) => {
    //   if (m.length === 0) {
    //     return;
    //   }
    //   if (!this.startTime) {
    //     this.startTime = Date.now()
    //   }

    //   console.log('Time', (Date.now() - (this.startTime ?? Date.now())) / 1000, m[m.length-1].offset)
    // })
    // map(messages => messages.slice(-500))
    )

  data$ = combineLatest([
    this.cluster$,
    this.consumer$,
    this.messages$,
  ]).pipe(
    map(([cluster, consumer, messages]) => {
      const formGroup: FormGroup = this.formBuilder.group({
        name: new FormControl(consumer.name),
        topic: new FormControl(consumer.topic),
        partition: new FormControl(0),
        offset: new FormControl(consumer.offset),
        follow: new FormControl(consumer.follow),
        filters: new FormArray(consumer.filters.map(filter => new FormControl(filter)))
      })

      formGroup.valueChanges.subscribe((value) => {
        this.consumerStore.store.upsert({
          id: consumer.id,
          topic: value.topic,
          name: value.name,
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
