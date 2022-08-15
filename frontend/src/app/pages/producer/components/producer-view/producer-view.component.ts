import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SocketService } from 'src/app/socket/socket.service';
import { Cluster } from 'src/app/store/cluster.store';
import { Producer } from 'src/app/store/producer.store';
import { Request, RequestStore } from 'src/app/store/request.store';
import * as uuid from 'uuid';

@Component({
  selector: 'app-producer-view',
  templateUrl: './producer-view.component.html',
  styleUrls: ['./producer-view.component.less']
})
export class ProducerViewComponent {
  constructor(
    private socketService: SocketService,
    private requestStore: RequestStore,
  ){}

  @Input()
  producer!: Producer;

  @Input()
  clusters!: Cluster[];

  @Input()
  formGroup!: FormGroup;

  @Input()
  requests!: Request[];

  produce() {
    const value = this.formGroup.value;
    const correlationId = uuid.v4();
    const data = {
      CorrelationId: correlationId,
      ClusterName: value.cluster.Name,
      Topic: value.topic,
      Partition: value.partition,
      Message: value.message,
    }

    this.socketService.send(
      {
        Topic: 'message.produce',
        Data: data 
      }
    );

    this.requestStore.add({
      correlationId,
      status: 'CREATED',
      producerName: this.producer.name,
      data: data,
    });
  }
}
