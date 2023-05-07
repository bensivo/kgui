import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgZorroModule } from '../../ng-zorro/ng-zorro.module';
import { WorkspacesComponent } from './workspaces.component';


@NgModule({
  declarations: [
    WorkspacesComponent
  ],
  imports: [
    CommonModule,
    NgZorroModule,
  ],
  exports: [
    WorkspacesComponent
  ],
})
export class WorkspacesModule { }
