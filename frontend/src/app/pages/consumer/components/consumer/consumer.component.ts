import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select } from '@ngneat/elf';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cluster, ClusterStore } from 'src/app/store/cluster.store';
import { Consumer, ConsumerStore } from 'src/app/store/consumer.store';
import { Message, MessagesStore } from 'src/app/store/messages.store';

@Component({
  selector: 'app-consumers',
  templateUrl: './consumer.component.html',
  styleUrls: ['./consumer.component.less']
})
export class ConsumerComponent {
  constructor(
    private clusterStore: ClusterStore,
    private consumerStore: ConsumerStore,
    private messagesStore: MessagesStore,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
  ) { }

  clusters$: Observable<Cluster[]> = this.clusterStore.store.pipe(
    select(s => s.clusters)
  );

  cluster$: Observable<Cluster | undefined> = this.clusterStore.store.pipe(
    select(s => s.active)
  );

  consumer$: Observable<Consumer> = combineLatest([
    this.route.params,
    this.consumerStore.store,
  ]).pipe(
    map(([params, consumers]) => {
      const consumer = consumers[params.id];
      if (!consumer) {
        this.router.navigate(['/consumers']);
      }
      return consumer;
    }),
  )

  messages$: Observable<Message[]> = this.messagesStore.forConsumer(this.consumer$);

  data$ = combineLatest([
    this.clusters$,
    this.cluster$,
    this.consumer$,
    this.messages$,
  ]).pipe(
    map(([clusters, cluster, consumer, messages]) => {

      const formGroup: FormGroup = this.formBuilder.group({
          cluster: new FormControl(cluster),
          topic: new FormControl(consumer.topic),
          partition: new FormControl(0),
          offset: new FormControl(consumer.offset),
          filters: new FormArray(consumer.filters.map(filter => new FormControl(filter)))
      })
      
      formGroup.valueChanges.subscribe((value) => {
        this.clusterStore.store.update((s) => ({
          ...s,
          active: value.cluster
        }))
      })

      return {
        clusters,
        cluster,
        consumer,
        formGroup,
        messages,
      }
    })
  )
}
