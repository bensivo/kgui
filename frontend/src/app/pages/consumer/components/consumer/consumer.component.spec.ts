import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { SocketService } from 'src/app/socket/socket.service';
import { ClusterStore } from 'src/app/store/cluster.store';
import { ProducerStore } from 'src/app/store/producer.store';

import { ConsumerComponent } from './consumer.component';

describe('ConsumersComponent', () => {
  let component: ConsumerComponent;
  let fixture: ComponentFixture<ConsumerComponent>;

  const clusterStore = {
    store: of({}),
  };

  const socketService = {
    stream: jasmine.createSpy('stream').and.returnValue(of({})),
  }


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsumerComponent ],
      providers: [
        { provide: ClusterStore, useValue: clusterStore},
        { provide: ProducerStore, useValue: {}},
        { provide: SocketService, useValue: socketService},
        { provide: ActivatedRoute, useValue: {}},
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
