import { Component, Input } from '@angular/core';
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
  cluster!: Cluster | undefined;

  @Input()
  consumer!: Consumer;

  @Input()
  messages!: Message[];

  @Input()
  formGroup!: FormGroup;

  get filters() {
    return this.formGroup.get('filters') as FormArray
  }

  consume() {
    this.messagesStore.store.update((s) => ({
      ...s,
      [this.consumer.id]: [],
    }))

    if (!this.cluster) {
      alert("Please select a cluster");
      return;
    }
    this.socketService.send({
      Topic: 'message.consume',
      Data: {
        ConsumerId: this.consumer.id,
        ClusterName: this.cluster.Name,
        Topic: this.formGroup.value.topic,
        Partition: 0,
        Offset: this.formGroup.value.offset
      }
    });
  }

  addFilter() {
    this.filters.push(new FormControl(''));
  }

  deleteFilter(index: number) {
    this.filters.removeAt(index)
  }

  filterTrackBy(i: number){
    return i
  }

  messageTrackBy(i: number, msg: Message){
    return msg.offset // TODO: test if 2 consumers end up with messages using the same offset
  }

  deleteConsumer() {
    this.consumerStore.store.remove(this.consumer.id);
  }
}
