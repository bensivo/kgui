import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageRawComponent } from './message-raw.component';

describe('MessageRawComponent', () => {
  let component: MessageRawComponent;
  let fixture: ComponentFixture<MessageRawComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageRawComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageRawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
