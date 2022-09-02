import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select } from '@ngneat/elf';
import { combineLatest, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Cluster, ClusterStore } from 'src/app/store/cluster.store';
import { Consumer, ConsumerStore } from 'src/app/store/consumer.store';
import { Message, MessagesStore } from 'src/app/store/messages.store';

@Component({
  selector: 'app-consumers',
  templateUrl: './consumer.component.html',
  styleUrls: ['./consumer.component.less']
})
export class ConsumerComponent {
  constructor(
    private clusterStore: ClusterStore,
    private consumerStore: ConsumerStore,
    private messagesStore: MessagesStore,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
  ) { }

  cluster$: Observable<Cluster | undefined> = this.clusterStore.store.pipe(
    select(s => s.active)
  );

  consumer$: Observable<Consumer> = combineLatest([this.route.params, this.consumerStore.store.entities$]).pipe(
    map(([params, consumers]) => {
      console.log(params, consumers)
      const consumer = consumers.find(c => c.id === params.id) 
      if (!consumer) {
        this.router.navigate(['/consumers']);
      }
      return consumer as Consumer;
    })
  )

  messages$: Observable<Message[]> = this.messagesStore.forConsumer(this.consumer$);

  data$ = combineLatest([
    this.cluster$,
    this.consumer$,
    this.messages$,
  ]).pipe(
    map(([cluster, consumer, messages]) => {

      const formGroup: FormGroup = this.formBuilder.group({
          name: new FormControl(consumer.name),
          topic: new FormControl(consumer.topic),
          partition: new FormControl(0),
          offset: new FormControl(consumer.offset),
          filters: new FormArray(consumer.filters.map(filter => new FormControl(filter)))
      })
      
      formGroup.valueChanges.subscribe((value) => {
        this.consumerStore.store.upsert({
          id: consumer.id,
          topic: value.topic,
          name: value.name,
          offset: value.offset,
          filters: value.filters,
        });
      })

      return {
        cluster,
        consumer,
        formGroup,
        messages,
      }
    })
  )
}
