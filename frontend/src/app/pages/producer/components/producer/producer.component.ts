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

  clusters$ = this.clusterStore.store.pipe(
    map(c => c.clusters)
  )

  activeCluster$ = this.clusterStore.store.pipe(
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
    this.clusters$,
    this.activeCluster$,
    this.producer$,
    this.requests$,
  ]).pipe(
    map(([clusters, activeCluster,producer, requests]) => {

      const formGroup = this.formBuilder.group({
        cluster: new FormControl(activeCluster),
        topic: new FormControl(producer.topic),
        name: new FormControl(producer.name),
        partition: new FormControl(producer.partition),
        message: new FormControl(producer.message),
      });

      formGroup.valueChanges.subscribe((value: any) => {
        this.clusterStore.store.update((s) => ({
          ...s,
          active: value.cluster
        }))

        this.producerStore.store.upsert({
          id: producer.id,
          name: value.name,
          topic: value.topic,
          partition: value.partition,
          message: value.message,
        });
      })

      return {
        clusters,
        producer,
        formGroup,
        requests,
      }
    })
  );
}
