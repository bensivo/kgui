import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { select } from '@ngneat/elf';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { SocketService } from 'src/app/socket/socket.service';
import { ClusterStore } from 'src/app/store/cluster.store';
import { ConsumerStore } from 'src/app/store/consumer.store';
import { MessagesStore } from 'src/app/store/messages.store';

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
  clusters$ = this.clusterStore.store.pipe(
    select(s => s.clusters)
  );

  consumer$ = combineLatest([
    this.route.params,
    this.consumerStore.store,
  ]).pipe(
    map(([params, consumers]) => {
      return consumers[params.name];
    }),
  )

  messages$ = combineLatest([
    this.route.params,
    this.messagesStore.store
  ]).pipe(
    map(([params, messages]) => {
      return messages[params.name] ?? []
    })
  )

  filteredMessages$ = combineLatest([
    this.messages$,
    this.consumer$
  ]).pipe(
    map(([messages, consumer]) => {
      let filteredMessages = [];
      let skipCounter = 0;

      fe_msg: for(const message of messages) {
        for(const filter of consumer.filters) {
          if (!message.includes(filter)) {
            if (skipCounter === 0) {
              filteredMessages.push(`...skipped ${++skipCounter}`);
            } else {
              filteredMessages[filteredMessages.length - 1] = `...skipped ${++skipCounter}`;
            }
            console.log('skip')
            continue fe_msg
          }
        } 

        console.log('push')
        skipCounter = 0;
        filteredMessages.push(message);
      }

      return filteredMessages
    })
  )

  data$ = combineLatest([
    this.clusters$,
    this.consumer$,
    this.filteredMessages$,
  ]).pipe(
    map(([clusters, consumer, messages]) => {

      const formGroup: FormGroup = this.formBuilder.group({
          cluster: new FormControl(clusters[0]),
          topic: new FormControl(consumer.topic),
          partition: new FormControl(0),
          offset: new FormControl(consumer.offset),
      })

      for(let i=0; i<consumer.filters.length; i++) {
        formGroup.addControl('filter'+i, new FormControl(consumer.filters[i]));
      }

      console.log(formGroup.value)

      return {
        clusters,
        consumer,
        messages,
        formGroup
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
