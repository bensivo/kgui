import { Component, Input, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { select } from '@ngneat/elf';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ClusterStore } from 'src/app/store/cluster.store';
import { ProducerStore } from 'src/app/store/producer.store';
import { RequestStore } from 'src/app/store/request.store';

@Component({
  selector: 'app-producer',
  template: `
    <app-producer-view *ngIf="producerViewData$ | async as data" [producer]="data.producer" [cluster]="data.cluster" [formGroup]="data.formGroup" [requests]="data.requests"></app-producer-view>
  `,
})
export class ProducerContainer {

  @Input()
  producerId!: string;
  producerId$ = new BehaviorSubject(this.producerId);
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.producerId)  {
      this.producerId$.next(changes.producerId.currentValue);
    }
  }

  constructor(
    private clusterStore: ClusterStore,
    private producerStore: ProducerStore,
    private formBuilder: FormBuilder,
    private requestStore: RequestStore,
  ) { }

  cluster$ = this.clusterStore.active$;

  producer$ = this.producerId$
    .pipe(
      mergeMap((id: string)=> {
        return this.producerStore.store.get(id)
      }),
      map((producer) => {
        if (!producer) {
          console.error('could not get producer with id')
        }
        return producer;
      })
    );

  requests$ = this.producerId$.pipe(
    mergeMap((producerId) => this.requestStore.store.pipe(
      select((s) => {
        // NOTE: somehow JS always returns these in the order they were added to the store.
        // Not sure why that happens, honestly. But we probably need to explicitly sort by request time
        return Object.values(s).filter(r => r.producerId === producerId)
      })
    ))
  )

  producerViewData$ = combineLatest([
    this.cluster$,
    this.producer$,
    this.requests$,
  ]).pipe(
    map(([cluster,producer, requests]) => {

      const formGroup = this.formBuilder.group({
        topic: new FormControl(producer.topic),
        name: new FormControl(producer.name),
        partition: new FormControl(producer.partition),
        message: new FormControl(producer.message),
      });

      formGroup.valueChanges.subscribe((value: any) => {
        this.producerStore.store.update(producer.id, {
          topic: value.topic,
          partition: value.partition,
          message: value.message,
        });
      })

      return {
        cluster,
        producer,
        formGroup,
        requests,
      }
    })
  );
}
