import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConsumerStore } from 'src/app/store/consumer.store';
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

  consumers$: Observable<any[]> = this.consumerStore.store.pipe(
    map((consumers) => {
      console.log(consumers)
        const values = Object.values(consumers)
        values.sort();
      console.log(values)
        return values;
    })
  );

  producers$: Observable<any[]> = this.producerStore.store.pipe(
    map((producers) => Object.values(producers))
  );

  addConsumer() {
    this.consumerStore.addConsumer();
  }
}
