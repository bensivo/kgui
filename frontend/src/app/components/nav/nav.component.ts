import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Consumer, ConsumerStore } from 'src/app/store/consumer.store';
import { ProducerStore } from 'src/app/store/producer.store';

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

  consumers$: Observable<Consumer[]> = this.consumerStore.consumers$;

  producers$: Observable<any[]> = this.producerStore.store.pipe(
    map((producers) => Object.values(producers))
  );

  addConsumer() {
    this.consumerStore.addConsumer({});
  }
}
