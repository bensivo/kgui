import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from '../tabs/tabs.module';



@NgModule({
  declarations: [
    HeaderComponent
  ],
  imports: [
    CommonModule,
    NzIconModule,
    NzSelectModule,
    ReactiveFormsModule,
    TabsModule,
  ],
  exports: [
    HeaderComponent,
  ],
})
export class HeaderModule { }
