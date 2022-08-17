import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { select } from '@ngneat/elf';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SocketService } from 'src/app/socket/socket.service';
import { Cluster, ClusterStore } from 'src/app/store/cluster.store';
import { Consumer, ConsumerStore } from 'src/app/store/consumer.store';
import { MessagesStore } from 'src/app/store/messages.store';
import { ConsumerItem } from '../consumer-item/consumer-item.component';

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
    private socketService: SocketService,
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

  items$: Observable<ConsumerItem[]> = combineLatest([
    this.route.params,
    this.messagesStore.store
  ]).pipe(
    select(([params, messages]) => {
      return messages[params.name] ?? []
    })
  )

  data$ = combineLatest([
    this.clusters$,
    this.consumer$,
    this.items$,
  ]).pipe(
    map(([clusters, consumer, items]) => {

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
        items,
      }
    })
  )

  async consume(event: any) {
    this.messagesStore.store.update((s) => ({
      ...s,
      [event.consumer.name]: [],
    }))

    this.socketService.send({
      Topic: 'message.consume',
      Data: {
        ConsumerName: event.consumer.name,
        ClusterName: event.cluster.Name,
        Topic: event.topic,
        Partition: event.partition,
        Offset: event.offset,
      }
    });
  }
}
