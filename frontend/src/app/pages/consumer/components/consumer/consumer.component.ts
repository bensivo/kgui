import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select } from '@ngneat/elf';
import { combineLatest, } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { SocketService } from 'src/app/socket/socket.service';
import { Cluster, ClusterStore } from 'src/app/store/cluster.store';
import { ConsumerStore } from 'src/app/store/consumer.store';
import { MessagesStore } from 'src/app/store/messages.store';

@Component({
  selector: 'app-consumers',
  templateUrl: './consumer.component.html',
  styleUrls: ['./consumer.component.less']
})
export class ConsumerComponent{
  constructor(
    private clusterStore: ClusterStore,
    private consumerStore: ConsumerStore,
    private messagesStore: MessagesStore,
    private socketService: SocketService,
    private route: ActivatedRoute
  ) { }

  topicInput = '';
  clusterInput!: Cluster | undefined;
  offsetInput = 0;

  clusters$ = this.clusterStore.store.pipe(
    select(s => s.clusters)
  );

  consumer$ = combineLatest([
    this.route.params,
    this.consumerStore.store,
  ]).pipe(
    map(([params, consumers]) => {
      const consumer = consumers[params.name];
      if (!consumer) {
        console.log(`Consumer ${params.name} not found`)
        return undefined;
      }

      console.log('Consumer', consumer)
      this.topicInput = consumer.topic;
      this.offsetInput = consumer.offset;
      return consumer;
    }),
  )

  messages$ = combineLatest([
    this.route.params,
    this.messagesStore.store
  ]).pipe(
    map(([params, messages]) => {
      console.log(messages);
      return messages[params.name]
    })
  )

  async consume() {
    this.route.params
    .pipe(first())
    .subscribe(params => {
        if (!params|| !this.clusterInput) {
          console.log('Invalid inputs', params, this.clusterInput)
          return;
        }

        this.messagesStore.store.update((s) => ({
          ...s,
          [params.name]: [],
        }))

        this.socketService.send({
          Topic: 'req.messages.consume',
          Data: {
            ConsumerName: params.name,
            ClusterName: this.clusterInput.Name,
            Topic: this.topicInput,
            Partition: 0,
            Offset: this.offsetInput,
          }
        });
    })
  }
  
}

