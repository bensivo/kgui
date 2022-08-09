import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select } from '@ngneat/elf';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { SocketService } from 'src/app/socket/socket.service';
import { Cluster, ClusterStore } from 'src/app/store/cluster.store';
import { ConsumerStore } from 'src/app/store/consumer.store';
import { MessagesStore } from 'src/app/store/messages.store';

@Component({
  selector: 'app-consumers',
  templateUrl: './consumers.component.html',
  styleUrls: ['./consumers.component.less']
})
export class ConsumersComponent implements OnInit {
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
      this.topicInput = consumer.topic;
      this.offsetInput = consumer.offset;
      return consumer;
    })
  )

  messages$ = combineLatest([
    this.route.params,
    this.messagesStore.store
  ]).pipe(
    map(([params, messages]) => {
      return messages[params.name]
    })
  )

  ngOnInit(): void {
    // Listens for messages coming from the backend, and adds them
    // to the proper location in the messages store
    // 
    // NOTE: This could probably in a service, not in this component
    combineLatest([
      this.consumer$,
      this.socketService.stream<any>('res.messages.consume'),
    ])
      .subscribe(([consumer, message]) => {
        console.log(`Message on consumer ${consumer?.name} - ${message}`)
        if (!consumer) {
          return;
        }

        this.messagesStore.store.update((state) => {
          const messages = state[consumer.name] ?? [];
          const newMsg = atob(message.Message.Value);
          messages.push(newMsg);

          return {
            ...state,
            [consumer.name]: messages
          }
        })
      });
  }

  consume() {
    if (!this.clusterInput) {
      return;
    }

    this.socketService.send({
      Topic: 'req.messages.consume',
      Data: {
        ClusterName: this.clusterInput.Name,
        Topic: this.topicInput,
        Partition: 0,
        Offset: this.offsetInput,
      }
    });
  }
}
