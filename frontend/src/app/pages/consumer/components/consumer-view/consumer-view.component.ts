import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Cluster } from 'src/app/store/cluster.store';
import { Consumer } from 'src/app/store/consumer.store';
import { ConsumerItem } from '../consumer-item/consumer-item.component';

@Component({
  selector: 'app-consumer-view',
  templateUrl: './consumer-view.component.html',
  styleUrls: ['./consumer-view.component.less']
})
export class ConsumerViewComponent {

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

  consume() {
    this.onConsume.emit({
      consumer: this.consumer,
      ...this.formGroup.value
    })
  }
}
