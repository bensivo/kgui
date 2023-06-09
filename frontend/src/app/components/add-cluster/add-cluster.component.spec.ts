import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { EmitterService } from 'src/app/emitter/emitter.service';

import { AddClusterComponent } from './add-cluster.component';

xdescribe('AddClusterComponent', () => {
  let component: AddClusterComponent;
  let fixture: ComponentFixture<AddClusterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NzFormModule,
        NzCheckboxModule,
        NzSelectModule,
        NzButtonModule,
        NzInputModule,
      ],
      declarations: [AddClusterComponent],
      providers: [
        {
          provide: EmitterService,
          useValue: {},
        },
        {
          provide: Router,
          useValue: {},
        },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddClusterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
