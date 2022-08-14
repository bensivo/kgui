import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Cluster } from 'src/app/store/cluster.store';
import { Consumer } from 'src/app/store/consumer.store';

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
  messages!: any[];

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
