import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Cluster } from 'src/app/store/cluster.store';
import { Producer } from 'src/app/store/producer.store';

@Component({
  selector: 'app-producer-view',
  templateUrl: './producer-view.component.html',
  styleUrls: ['./producer-view.component.less']
})
export class ProducerViewComponent {
  constructor(){}

  @Input()
  producer!: Producer;

  @Input()
  clusters!: Cluster[];

  @Input()
  formGroup!: FormGroup;

  @Output()
  onProduce = new EventEmitter<any>();

  produce() {
    this.onProduce.emit(this.formGroup.value);
  }
}
