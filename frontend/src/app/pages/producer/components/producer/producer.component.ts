import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select } from '@ngneat/elf';
import { combineLatest, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ClusterStore } from 'src/app/store/cluster.store';
import { ProducerStore } from 'src/app/store/producer.store';
import { RequestStore } from 'src/app/store/request.store';

@Component({
  selector: 'app-producer',
  templateUrl: './producer.component.html',
  styleUrls: ['./producer.component.less']
})
export class ProducerComponent {

  constructor(
    private clusterStore: ClusterStore,
    private producerStore: ProducerStore,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private requestStore: RequestStore,
    private router: Router,
  ) { }

  cluster$ = this.clusterStore.store.pipe(
    map(c => c.active)
  )

  producerId$: Observable<string> = this.route.params.pipe(
    map(params => params['id'])
  );

  producer$ = this.producerId$
    .pipe(
      mergeMap((id: string)=> {
        return this.producerStore.store.get(id)
      }),
      map((producer) => {
        if (!producer) {
          this.router.navigate(['/producers']);
        }
        return producer;
      })
    );

  requests$ = this.producerId$.pipe(
    mergeMap((producerId) => this.requestStore.store.pipe(
      select((s) => {
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
        this.producerStore.store.upsert({
          id: producer.id,
          name: value.name,
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
