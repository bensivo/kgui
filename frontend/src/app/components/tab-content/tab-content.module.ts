import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabContentComponent } from './tab-content.component';
import { TabContentContainer } from './tabs.container';



@NgModule({
  declarations: [
    TabContentComponent,
    TabContentContainer,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TabContentComponent,
    TabContentContainer,
  ],
})
export class TabContentModule { }
