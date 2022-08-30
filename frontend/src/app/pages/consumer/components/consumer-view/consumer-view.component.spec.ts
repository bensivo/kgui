import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormGroup } from '@angular/forms';
import { SocketService } from 'src/app/socket/socket.service';
import { ConsumerStore } from 'src/app/store/consumer.store';
import { MessagesStore } from 'src/app/store/messages.store';

import { ConsumerViewComponent } from './consumer-view.component';

describe('ConsumerViewComponent', () => {
  let component: ConsumerViewComponent;
  let fixture: ComponentFixture<ConsumerViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsumerViewComponent ],
      providers: [
        {provide: ConsumerStore, useValue: {}},
        {provide: SocketService, useValue: {}},
        {provide: MessagesStore, useValue: {}},
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerViewComponent);
    component = fixture.componentInstance;
    component.formGroup = new FormGroup({
      filters: new FormArray([]),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
