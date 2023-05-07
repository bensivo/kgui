import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmitterModule } from './emitter/emitter.module';

import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { RouterModule } from '@angular/router';
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
import { LayoutModule } from './layout/layout.module';
import { TabContentModule } from './components/tab-content/tab-content.module';
import { ClusterModule } from './components/cluster/cluster.module';
import { AddClusterModule } from './components/add-cluster/add-cluster.module';
import { NgZorroModule } from './ng-zorro/ng-zorro.module';
import { NavModule } from './components/nav/nav.module';
import { HeaderModule } from './components/header/header.module';
import { FormsModule } from '@angular/forms';
registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    FormsModule,
    BrowserAnimationsModule,
    EmitterModule,
    NavModule,
    TabContentModule,
    AddClusterModule,
    RouterModule,
    HeaderModule,
    NgZorroModule,
    ClusterModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
