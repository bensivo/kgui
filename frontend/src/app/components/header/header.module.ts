import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgZorroModule } from 'src/app/ng-zorro/ng-zorro.module';
import { TabsModule } from '../tabs/tabs.module';
import { HeaderComponent } from './header.component';



@NgModule({
  declarations: [
    HeaderComponent
  ],
  imports: [
    CommonModule,
    NgZorroModule,
    ReactiveFormsModule,
    TabsModule,
  ],
  exports: [
    HeaderComponent,
  ],
})
export class HeaderModule { }
