import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  ) { }
  clusters$: Observable<Cluster[]> = this.clusterStore.store.pipe(
    select(s => s.clusters)
  );

  consumer$: Observable<Consumer> = combineLatest([
    this.route.params,
    this.consumerStore.store,
  ]).pipe(
    map(([params, consumers]) => {
      return consumers[params.name];
    }),
  )

  messages$: Observable<Message[]> = this.messagesStore.forConsumer(this.consumer$);

  data$ = combineLatest([
    this.clusters$,
    this.consumer$,
    this.messages$,
  ]).pipe(
    map(([clusters, consumer, messages]) => {

      const formGroup: FormGroup = this.formBuilder.group({
          cluster: new FormControl(clusters[0]),
          topic: new FormControl(consumer.topic),
          partition: new FormControl(0),
          offset: new FormControl(consumer.offset),
          filters: new FormArray(consumer.filters.map(filter => new FormControl(filter)))
      })

      return {
        clusters,
        consumer,
        formGroup,
        messages,
      }
    })
  )
}
