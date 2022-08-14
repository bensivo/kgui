import { ActivatedRoute } from '@angular/router';
import { SocketService } from 'src/app/socket/socket.service';
import { ProducerStore } from 'src/app/store/producer.store';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClusterStore } from 'src/app/store/cluster.store';

import { ProducerComponent } from './producer.component';
import { of } from 'rxjs';

describe('ProducerComponent', () => {
  let component: ProducerComponent;
  let fixture: ComponentFixture<ProducerComponent>;

  const clusterStore = {
    store: of({})
  };

  const producerStore = {
    getProducer: jasmine.createSpy('getProducer')
  }

  const activatedRoute = {
    params: of({})
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProducerComponent ],
      providers: [
        { provide: ClusterStore, useValue: clusterStore},
        { provide: ProducerStore, useValue: producerStore},
        { provide: SocketService, useValue: {}},
        { provide: ActivatedRoute, useValue: activatedRoute},
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProducerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
