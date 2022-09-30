import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabContentComponent } from './tab-content.component';
import { TabContentContainer } from './tabs.container';
import { ConsumerModule } from 'src/app/pages/consumer/consumer.module';
import { ProducerModule } from 'src/app/pages/producer/producer.module';



@NgModule({
  declarations: [
    TabContentComponent,
    TabContentContainer,
  ],
  imports: [
    CommonModule,
    ConsumerModule,
    ProducerModule,
  ],
  exports: [
    TabContentComponent,
    TabContentContainer,
  ],
})
export class TabContentModule { }
