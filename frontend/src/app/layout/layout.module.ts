import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutWithSidebarComponent } from './layout-with-sidebar/layout-with-sidebar.component';
import { LayoutFullscreenComponent } from './layout-fullscreen/layout-fullscreen.component';
import { RouterModule } from '@angular/router';
import { NgZorroModule } from '../ng-zorro/ng-zorro.module';
import { NavModule } from '../components/nav/nav.module';
import { HeaderModule } from '../components/header/header.module';
import { AppRoutingModule } from '../app-routing.module';
import { BrowserModule } from '@angular/platform-browser';



@NgModule({
  declarations: [
    LayoutWithSidebarComponent,
    LayoutFullscreenComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule,
    NgZorroModule,
    NavModule,
    HeaderModule,
  ],
  exports: [
    LayoutWithSidebarComponent,
    LayoutFullscreenComponent
  ],
})
export class LayoutModule { }
