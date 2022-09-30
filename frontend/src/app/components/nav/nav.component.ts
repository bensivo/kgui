import { Component } from '@angular/core';
import { nanoid } from 'nanoid';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Consumer, ConsumerStore } from 'src/app/store/consumer.store';
import { Producer, ProducerStore } from 'src/app/store/producer.store';
import { Tab, TabStore } from 'src/app/store/tab.store';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.less']
})
export class NavComponent {
  constructor(
    private consumerStore: ConsumerStore,
    private producerStore: ProducerStore,
    private tabStore: TabStore,
  ) { }

  isCollapsed = false;

  consumers$: Observable<Consumer[]> = this.consumerStore.store.entities$
  producers$: Observable<Producer[]> = this.producerStore.store.entities$

  onSelectConsumer(consumer: Consumer) {
    const existing = this.tabStore.store.entities.find(t => 
      t.targetType === 'consumer' && t.targetId === consumer.id
    )
    if (existing) {
      this.tabStore.selectTab(existing.id)
      return;
    }

    const tab: Tab = {
      id: nanoid(),
      active: true,
      name: consumer.name,
      targetType: 'consumer',
      targetId: consumer.id
    };
    this.tabStore.store.upsert(tab);
    this.tabStore.selectTab(tab.id);
  }

  onSelectProducer(producer: Producer) {
    const existing = this.tabStore.store.entities.find(t => 
      t.targetType === 'producer' && t.targetId === producer.id
    )
    if (existing) {
      this.tabStore.selectTab(existing.id)
      return;
    }
    const tab: Tab = {
      id: nanoid(),
      active: true,
      name: producer.name,
      targetType: 'producer',
      targetId: producer.id
    };
    this.tabStore.store.upsert(tab);
    this.tabStore.selectTab(tab.id);
  }

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
