import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageJsonComponent } from './message-json.component';

describe('MessageJsonComponent', () => {
  let component: MessageJsonComponent;
  let fixture: ComponentFixture<MessageJsonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageJsonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageJsonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
