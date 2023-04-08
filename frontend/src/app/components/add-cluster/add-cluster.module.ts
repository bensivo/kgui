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
import { AddClusterComponent } from './add-cluster.component';
import { AddClusterContainer } from './add-cluster.container';

@NgModule({
  declarations: [
    AddClusterContainer,
    AddClusterComponent,
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
    AddClusterContainer,
  ],
})
export class AddClusterModule { }
