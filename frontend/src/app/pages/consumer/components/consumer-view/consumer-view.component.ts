import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Cluster } from 'src/app/store/cluster.store';
import { Consumer, ConsumerStore } from 'src/app/store/consumer.store';
import { ConsumerItem } from '../consumer-item/consumer-item.component';

@Component({
  selector: 'app-consumer-view',
  templateUrl: './consumer-view.component.html',
  styleUrls: ['./consumer-view.component.less']
})
export class ConsumerViewComponent {

  constructor( private consumerStore: ConsumerStore) { }

  @Input()
  consumer!: Consumer;

  @Input()
  clusters!: Cluster[];

  @Input()
  items!: ConsumerItem[];

  @Input()
  formGroup!: FormGroup;

  @Output()
  onConsume = new EventEmitter<any>();

  get filters() {
    return this.formGroup.get('filters') as FormArray
  }

  consume() {
    console.log(this.formGroup.value)
    this.updateConsumer();

    this.onConsume.emit({
      consumer: this.consumer,
      ...this.formGroup.value
    })
  }

  addFilter() {
    this.filters.push(new FormControl(''));
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
      [this.consumer.name]:newConsumer 
    }))
  }
}
