import * as uuid from 'uuid';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { SocketService } from 'src/app/socket/socket.service';
import { Cluster, ClusterStore } from 'src/app/store/cluster.store';
import { ProducerStore } from 'src/app/store/producer.store';

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
    private route: ActivatedRoute
  ) { }

  topicInput = '';
  clusterInput!: Cluster | undefined;
  partitionInput = 0;
  messageInput = '';

  clusters$ = this.clusterStore.store.pipe(
    map(s => s.clusters)
  );

  producer$ = combineLatest([
    this.route.params,
    this.producerStore.store,
  ]).pipe(
    map(([params, producers]) => {
      const producer = producers[params.name];
      if (!producer) {
        console.log(`Producer ${params.name} not found in list`, producers)
        return undefined;
      }

      console.log('Producer', producer)
      this.topicInput = producer.topic;
      this.partitionInput = 0;
      this.messageInput = producer.message;
      return producer;
    }),
  )


  produce() {
    if (!this.clusterInput) {
      return;
    }

    this.socketService.send(
      {
        Topic: 'message.produce',
        Data: {
          CorrelationId: uuid.v4(),
          ClusterName: this.clusterInput.Name,
          Topic: this.topicInput,
          Partition: this.partitionInput,
          Message: this.messageInput,
        }
      }
    );
  }
}
