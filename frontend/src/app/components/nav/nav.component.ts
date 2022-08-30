import { Component } from '@angular/core';
import { nanoid } from 'nanoid';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Consumer, ConsumerStore } from 'src/app/store/consumer.store';
import { Producer, ProducerStore } from 'src/app/store/producer.store';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.less']
})
export class NavComponent {
  constructor(
    private consumerStore: ConsumerStore,
    private producerStore: ProducerStore,
  ) { }

  isCollapsed = false;

  consumers$: Observable<Consumer[]> = this.consumerStore.store.entities$
  producers$: Observable<Producer[]> = this.producerStore.store.entities$

  addConsumer() {
    this.consumerStore.store.upsert({
      id: nanoid(),
      name: 'Untitled',
      topic: '',
      offset: 0,
      filters: [],
    });
  }

  addProducer() {
    this.producerStore.store.upsert({
      id: nanoid(),
      name: 'Untitled',
      topic: '',
      partition: 0,
      message: '',
    });
  }
}
