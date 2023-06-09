import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { EmitterService } from 'src/app/emitter/emitter.service';
import { Cluster } from 'src/app/store/cluster.store';
import { Consumer, ConsumerStore } from 'src/app/store/consumer.store';
import { Message, MessagesStore, MessageType } from 'src/app/store/messages.store';

@Component({
  selector: 'app-consumer-view',
  templateUrl: './consumer.component.html',
  styleUrls: ['./consumer.component.less'],

})
export class ConsumerComponent{
 @Input()
  cluster!: Cluster | null;

  @Input()
  consumer!: Consumer;

  @Input()
  messages!: Message[];

  @Input()
  formGroup!: FormGroup;

  messageFormat: string = 'TREE';

  constructor(
    private emitterService: EmitterService,
    private messagesStore: MessagesStore,
    private notification: NzNotificationService,
  ) { }

  get filters() {
    return this.formGroup.get('filters') as FormArray
  }

  get isConsuming(): boolean {
    return this.messages.length > 0 && this.messages[0].type !== MessageType.EOS
  }

  consume() {
    this.messagesStore.store.update((s) => ({
      ...s,
      [this.consumer.id]: [],
    }))

    if (!this.cluster) {
      this.notification.create('error', 'Error', 'Please select a cluster')
      return;
    }
    this.emitterService.emitter.send({
      Topic: 'message.consume',
      Data: {
        ConsumerId: this.consumer.id,
        Topic: this.formGroup.value.topic,
        Offset: this.formGroup.value.offset,
        Follow: this.formGroup.value.follow,
        Cluster: {
          ...this.cluster,
        },
      }
    });
  }

  stop() {
    this.emitterService.emitter.send({
      Topic: 'message.stop',
      Data: {
        ConsumerId: this.consumer.id,
      }
    });
  }

  addFilter() {
    this.filters.push(new FormControl(''));
  }

  deleteFilter(index: number) {
    this.filters.removeAt(index)
  }

  filterTrackBy(i: number) {
    return i
  }

  messageTrackBy(i: number, msg: Message) {
    return `${msg.partition}-${msg.offset}`; // TODO: test if 2 consumers end up with messages using the same offset
  }
}
