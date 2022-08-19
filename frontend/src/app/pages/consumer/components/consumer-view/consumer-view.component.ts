import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { SocketService } from 'src/app/socket/socket.service';
import { Cluster } from 'src/app/store/cluster.store';
import { Consumer, ConsumerStore } from 'src/app/store/consumer.store';
import { Message, MessagesStore } from 'src/app/store/messages.store';

@Component({
  selector: 'app-consumer-view',
  templateUrl: './consumer-view.component.html',
  styleUrls: ['./consumer-view.component.less']
})
export class ConsumerViewComponent {

  constructor(
    private consumerStore: ConsumerStore,
    private socketService: SocketService,
    private messagesStore: MessagesStore
  ) { }

  @Input()
  consumer!: Consumer;

  @Input()
  clusters!: Cluster[];

  @Input()
  messages!: Message[];

  @Input()
  formGroup!: FormGroup;

  get filters() {
    return this.formGroup.get('filters') as FormArray
  }

  consume() {
    this.updateConsumer();

    this.messagesStore.store.update((s) => ({
      ...s,
      [this.consumer.name]: [],
    }))

    this.socketService.send({
      Topic: 'message.consume',
      Data: {
        ConsumerName: this.consumer.name,
        ClusterName: this.formGroup.value.cluster.Name,
        Topic: this.formGroup.value.topic,
        Partition: 0,
        Offset: this.formGroup.value.offset
      }
    });
  }

  addFilter() {
    this.filters.push(new FormControl(''));
    this.updateConsumer();
  }

  deleteFilter(index: number) {
    this.filters.removeAt(index)
    this.updateConsumer();
  }

  updateConsumer() {
    const value = this.formGroup.value;
    const newConsumer: Consumer = {
      topic: value.topic,
      name: this.consumer.name,
      offset: value.offset,
      filters: value.filters,
    };

    console.log('Consumer', newConsumer)

    this.consumerStore.store.update((s) => ({
      ...s,
      [this.consumer.name]: newConsumer
    }))
  }
}
