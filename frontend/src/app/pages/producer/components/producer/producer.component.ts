import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { SocketService } from 'src/app/socket/socket.service';
import { ClusterStore } from 'src/app/store/cluster.store';
import { ProducerStore } from 'src/app/store/producer.store';
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
  ) { }

  clusters$ = this.clusterStore.store.pipe(
    map(s => s.clusters)
  )

  producerName$ = this.route.params.pipe(
    map(params => params.name)
  )

  producerViewData$ = combineLatest([
    this.clusters$,
    this.producerStore.getProducer(this.producerName$),
  ]).pipe(
    map(([clusters, producer]) => {

      const formGroup = this.formBuilder.group({
        cluster: new FormControl(clusters[0]),
        topic: new FormControl(producer.topic),
        partition: new FormControl(0),
        message: new FormControl(producer.message),
      });

      return {
        clusters,
        producer,
        formGroup,
      }
    })
  );

  produce(value: any) {
    this.socketService.send(
      {
        Topic: 'message.produce',
        Data: {
          CorrelationId: uuid.v4(),
          ClusterName: value.cluster.Name,
          Topic: value.topic,
          Partition: value.partition,
          Message: value.message,
        }
      }
    );
  }
}
