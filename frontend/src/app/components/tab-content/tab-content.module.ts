import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabContentComponent } from './tab-content.component';
import { TabContentContainer } from './tabs.container';
import { ConsumerModule } from 'src/app/pages/consumer/consumer.module';



@NgModule({
  declarations: [
    TabContentComponent,
    TabContentContainer,
  ],
  imports: [
    CommonModule,
    ConsumerModule,
  ],
  exports: [
    TabContentComponent,
    TabContentContainer,
  ],
})
export class TabContentModule { }
