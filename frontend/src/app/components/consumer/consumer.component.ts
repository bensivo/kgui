import { AfterViewChecked, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { SocketService } from 'src/app/socket/socket.service';
import { Cluster } from 'src/app/store/cluster.store';
import { Consumer, ConsumerStore } from 'src/app/store/consumer.store';
import { Message, MessagesStore, MessageType } from 'src/app/store/messages.store';

@Component({
  selector: 'app-consumer-view',
  templateUrl: './consumer.component.html',
  styleUrls: ['./consumer.component.less'],

})
export class ConsumerComponent implements AfterViewChecked {
 @Input()
  cluster!: Cluster | undefined;

  @Input()
  consumer!: Consumer;

  @Input()
  messages!: Message[];

  @Input()
  formGroup!: FormGroup;

  @ViewChild('messageScrollView') private messageScrollView!: ElementRef;

  constructor(
    private consumerStore: ConsumerStore,
    private socketService: SocketService,
    private messagesStore: MessagesStore,
    private notification: NzNotificationService,
  ) { }


  ngAfterViewChecked() {
    // Useful hook for after the messages have been loaded into the consumer
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.messageScrollView.nativeElement.scrollTop = this.messageScrollView.nativeElement.scrollHeight;
    } catch (err) { }
  }

  get filters() {
    return this.formGroup.get('filters') as FormArray
  }

  get isConsuming(): boolean {
    return this.messages.length > 0 && this.messages[this.messages.length - 1].type !== MessageType.EOS
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
    this.socketService.send({
      Topic: 'message.consume',
      Data: {
        ConsumerId: this.consumer.id,
        ClusterName: this.cluster.Name,
        Topic: this.formGroup.value.topic,
        Partition: 0,
        Offset: this.formGroup.value.offset,
        Follow: this.formGroup.value.follow
      }
    });
  }

  stop() {
    this.socketService.send({
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
    return msg.offset // TODO: test if 2 consumers end up with messages using the same offset
  }

  deleteConsumer() {
    this.consumerStore.store.remove(this.consumer.id);
  }
}
