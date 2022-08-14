import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerViewComponent } from './consumer-view.component';

describe('ConsumerViewComponent', () => {
  let component: ConsumerViewComponent;
  let fixture: ComponentFixture<ConsumerViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsumerViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
