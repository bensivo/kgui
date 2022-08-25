import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { SocketService } from 'src/app/socket/socket.service';
import { Cluster, ClusterStore } from 'src/app/store/cluster.store';
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
    private clusterStore: ClusterStore,
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

  isEditingTitle: boolean = false;
  titleInput = '';

  get filters() {
    return this.formGroup.get('filters') as FormArray
  }

  consume() {
    this.updateConsumer();

    this.messagesStore.store.update((s) => ({
      ...s,
      [this.consumer.id]: [],
    }))

    this.socketService.send({
      Topic: 'message.consume',
      Data: {
        ConsumerId: this.consumer.id,
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
      id: this.consumer.id,
      topic: value.topic,
      name: this.titleInput,
      offset: value.offset,
      filters: value.filters,
    };

    this.consumerStore.updateConsumer(this.consumer.id, newConsumer);
  }

  deleteConsumer() {
    this.consumerStore.store.update(s  => {
      const newState = {...s}
      delete newState[this.consumer.id];
      return newState;
    })
  }

  editTitle() {
    this.titleInput = this.consumer.name;
    this.isEditingTitle = true
  }

  saveTitle() {
    this.isEditingTitle = false;
    console.log('Setting title to ', this.titleInput);
    this.updateConsumer();

  }
}
