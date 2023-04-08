import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { ClusterComponent } from './cluster.component';

@NgModule({
  declarations: [
    ClusterComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzCardModule,
    NzFormModule,
    NzCheckboxModule,
    NzSelectModule,
    NzButtonModule,
    NzInputModule,
    NzSpaceModule,
    NzIconModule,
  ],
  exports: [
    ClusterComponent,
  ],
})
export class ClusterModule { }
