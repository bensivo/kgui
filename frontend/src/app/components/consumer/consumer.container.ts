import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select } from '@ngneat/elf';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
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
export class ConsumerContainer implements OnChanges{

  @Input()
  consumerId!: string;

  consumerId$ = new BehaviorSubject(this.consumerId);
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.consumerId)  {
      this.consumerId$.next(changes.consumerId.currentValue);
    }
  }

  constructor(
    private clusterStore: ClusterStore,
    private consumerStore: ConsumerStore,
    private messagesStore: MessagesStore,
    private formBuilder: FormBuilder,
    // private router: Router,
  ) { }



  cluster$: Observable<Cluster | undefined> = this.clusterStore.store.pipe(
    select(s => s.active)
  );

  consumer$: Observable<Consumer> = combineLatest([this.consumerId$, this.consumerStore.store.entities$]).pipe(
    map(([consumerId, consumers]) => {
      const consumer = consumers.find(c => c.id === consumerId)
      if (!consumer) {
        console.error('Cannot find consumer with id', consumerId)
        // this.router.navigate(['/consumers']);
      }
      return consumer as Consumer;
    })
  )

  messages$: Observable<Message[]> = this.messagesStore.forConsumer(this.consumer$);

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
        filters: new FormArray(consumer.filters.map(filter => new FormControl(filter)))
      })

      formGroup.valueChanges.subscribe((value) => {
        this.consumerStore.store.upsert({
          id: consumer.id,
          topic: value.topic,
          name: value.name,
          offset: value.offset,
          filters: value.filters,
        });
      })

      return {
        cluster,
        consumer,
        formGroup,
        messages,
      }
    })
  )
}
