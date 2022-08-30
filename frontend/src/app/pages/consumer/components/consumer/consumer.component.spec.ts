import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { ClusterStore } from 'src/app/store/cluster.store';
import { Consumer, ConsumerStore } from 'src/app/store/consumer.store';
import { Message, MessagesStore } from 'src/app/store/messages.store';
import { ConsumerComponent } from './consumer.component';


describe('ConsumersComponent', () => {
  let component: ConsumerComponent;
  let fixture: ComponentFixture<ConsumerComponent>;

  const clusterState = {
    clusters: [{
      name: 'cluster-1'
    }],
    active: {
      name: 'cluster-1'
    }
  }
  const consumers = [{
    id: 'test-consumer-id',
    name: 'test-consumer',
    topic: 'test-topic',
    offset: 0,
    filters: [],
  }] as Consumer[];
  const params = {
    id: 'test-consumer-id'
  };
  const messages = [] as Message[];

  const clusterStore = {
    store: new BehaviorSubject(clusterState),
  };

  const consumerStore = {
    store: {
      entities$: new BehaviorSubject(consumers),
    }
  };

  const messagesStore = {
    store: new BehaviorSubject(messages),
    forConsumer: jasmine.createSpy('forConsumer').and.returnValue(of(messages))
  }

  const route = {
    params: new BehaviorSubject(params),
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ConsumerComponent],
      providers: [
        { provide: ClusterStore, useValue: clusterStore },
        { provide: ConsumerStore, useValue: consumerStore },
        { provide: MessagesStore, useValue: messagesStore },
        { provide: ActivatedRoute, useValue: route },
        {
          provide: Router, useValue: {
            navigate: jasmine.createSpy('navigate'),
          }
        },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ConsumerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('data$', () => {
    it('should contain clusters', (done) => {
      component.data$.subscribe(() => {
        done()
      });
    });

    it('should contain the consumer for the given route', () => {

    });

    it('should contain items from messagesStore', () => {

    });

    it('should contain a formGroup with proper inputs', () => {

    });
  })
});
