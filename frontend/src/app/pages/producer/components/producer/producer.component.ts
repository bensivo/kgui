import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { select } from '@ngneat/elf';
import { combineLatest } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { SocketService } from 'src/app/socket/socket.service';
import { ClusterStore } from 'src/app/store/cluster.store';
import { ProducerStore } from 'src/app/store/producer.store';
import { RequestStore } from 'src/app/store/request.store';
import * as uuid from 'uuid';

@Component({
  selector: 'app-producer',
  templateUrl: './producer.component.html',
  styleUrls: ['./producer.component.less']
})
export class ProducerComponent {

  constructor(
    private clusterStore: ClusterStore,
    private producerStore: ProducerStore,
    private socketService: SocketService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private requestStore: RequestStore,
  ) { }

  clusters$ = this.clusterStore.store.pipe(
    map(s => s.clusters)
  )

  producerName$ = this.route.params.pipe(
    map(params => params.name)
  )

  requests$ = this.producerName$.pipe(
    mergeMap((producerName) => this.requestStore.store.pipe(
      select((s) => {
        return Object.values(s).filter(r => r.producerName === producerName)
      })
    ))
  )

  producerViewData$ = combineLatest([
    this.clusters$,
    this.producerStore.get(this.producerName$),
    this.requests$,
  ]).pipe(
    map(([clusters, producer, requests]) => {

      const formGroup = this.formBuilder.group({
        cluster: new FormControl(clusters[0]),
        topic: new FormControl(producer.topic),
        partition: new FormControl(0),
        message: new FormControl(producer.message),
      });

      const data = {
        clusters,
        producer,
        formGroup,
        requests,
      }
      return data;
    })
  );
}
