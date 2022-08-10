import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageTreeComponent } from './message-tree.component';

describe('MessageTreeComponent', () => {
  let component: MessageTreeComponent;
  let fixture: ComponentFixture<MessageTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
