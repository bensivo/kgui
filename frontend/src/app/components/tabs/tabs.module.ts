import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { TabsComponent } from './tabs.component';
import { TabsContainer } from './tabs.container';

@NgModule({
  declarations: [
    TabsContainer,
    TabsComponent,
  ],
  imports: [
    CommonModule,
    NzIconModule,
    NzSelectModule,
    NzTabsModule,
  ],
  exports: [
    TabsContainer
  ],
})
export class TabsModule { }
