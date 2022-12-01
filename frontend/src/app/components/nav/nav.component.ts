import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { nanoid } from 'nanoid';
import { Observable } from 'rxjs';
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
    private router: Router,
  ) { }

  isCollapsed = false;

  consumers$: Observable<Consumer[]> = this.consumerStore.store.entities$
  producers$: Observable<Producer[]> = this.producerStore.store.entities$

  onSelectConsumer(consumer: Consumer) {
    // See if this consumer is already in a tab
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
      follow: false,
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
