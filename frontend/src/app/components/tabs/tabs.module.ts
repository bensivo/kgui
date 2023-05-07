import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgZorroModule } from 'src/app/ng-zorro/ng-zorro.module';
import { TabsComponent } from './tabs.component';
import { TabsContainer } from './tabs.container';

@NgModule({
  declarations: [
    TabsContainer,
    TabsComponent,
  ],
  imports: [
    CommonModule,
    NgZorroModule,
  ],
  exports: [
    TabsContainer
  ],
})
export class TabsModule { }
