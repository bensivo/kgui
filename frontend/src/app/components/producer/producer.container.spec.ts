import { ActivatedRoute, Router } from '@angular/router';
import { SocketService } from 'src/app/socket/socket.service';
import { ProducerStore } from 'src/app/store/producer.store';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClusterStore } from 'src/app/store/cluster.store';

import { ProducerContainer } from './producer.container';
import { BehaviorSubject, of } from 'rxjs';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RequestStore } from 'src/app/store/request.store';

describe('ProducerContainer', () => {
  let component: ProducerContainer;
  let fixture: ComponentFixture<ProducerContainer>;

  const clusterStore = {
    store: of({})
  };

  const producerStore = {
    getProducer: jasmine.createSpy('getProducer')
  }

  const requestStore = {
    store: new BehaviorSubject({}),
  }

  const activatedRoute = {
    params: of({})
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
      ],
      declarations: [ ProducerContainer ],
      providers: [
        { provide: ClusterStore, useValue: clusterStore},
        { provide: ProducerStore, useValue: producerStore},
        { provide: RequestStore, useValue: requestStore},
        { provide: SocketService, useValue: {
          stream: jasmine.createSpy('stream')
        }},
        { provide: ActivatedRoute, useValue: activatedRoute},
        { provide: Router, useValue: {}},
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProducerContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
