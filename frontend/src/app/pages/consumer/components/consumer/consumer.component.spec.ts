import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { Cluster, ClusterStore } from 'src/app/store/cluster.store';
import { Consumer, ConsumerStore } from 'src/app/store/consumer.store';
import { MessagesStore } from 'src/app/store/messages.store';
import { ConsumerItem } from '../consumer-item/consumer-item.component';
import { ConsumerComponent } from './consumer.component';


describe('ConsumersComponent', () => {
  let component: ConsumerComponent;
  let fixture: ComponentFixture<ConsumerComponent>;

  const clusterState = {
    clusters: []
  }
  const consumers = [{
    name: 'test',
  }] as Consumer[];
  const messages = [] as ConsumerItem[];
  const params = {
    name: 'test'
  } as Consumer;

  const clusterStore = {
    store: new BehaviorSubject(clusterState),
  };

  const consumerStore = {
    store: new BehaviorSubject(consumers),
  };

  const messagesStore = {
    store: new BehaviorSubject(messages),
  }

  const route = {
    params: new BehaviorSubject(params),
  }



  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ ConsumerComponent ],
      providers: [
        { provide: ClusterStore, useValue: clusterStore},
        { provide: ConsumerStore, useValue: consumerStore},
        { provide: MessagesStore, useValue: messagesStore},
        { provide: ActivatedRoute, useValue: route},
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

      // fixture.detectChanges();

      // expect(spy).toHaveBeenCalledWith(jasmine.objectContaining({
      //   clusters: clusterState.clusters,
      // }))
    });

    it('should contain the consumer for the given route', () => {

    });

    it('should contain items from messagesStore', () => {

    });

    it('should contain a formGroup with proper inputs', () => {

    });
  })
});
