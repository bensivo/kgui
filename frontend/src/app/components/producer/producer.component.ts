import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { SocketService } from 'src/app/socket/socket.service';
import { Cluster } from 'src/app/store/cluster.store';
import { Producer, ProducerStore } from 'src/app/store/producer.store';
import { Request, RequestStore } from 'src/app/store/request.store';
import * as uuid from 'uuid';

@Component({
  selector: 'app-producer-view',
  templateUrl: './producer.component.html',
  styleUrls: ['./producer.component.less']
})
export class ProducerViewComponent {
  constructor(
    private socketService: SocketService,
    private producerStore: ProducerStore,
    private requestStore: RequestStore,
    private notification: NzNotificationService,
  ){}

  @Input()
  producer!: Producer;

  @Input()
  cluster!: Cluster | undefined;

  @Input()
  formGroup!: FormGroup;

  @Input()
  requests!: Request[];

  produce() {
    if (!this.cluster) {
      this.notification.create('error', 'Error', 'Please select a cluster')
      return;
    }
    const value = this.formGroup.value;
    const correlationId = uuid.v4();
    const data = {
      CorrelationId: correlationId,
      ClusterName: this.cluster.Name,
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
      producerId: this.producer.id,
      data: data,
    });
  }

  deleteProducer() {
    this.producerStore.store.remove(this.producer.id);
  }
}
