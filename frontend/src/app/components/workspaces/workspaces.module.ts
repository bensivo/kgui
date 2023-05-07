import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspacesComponent } from './workspaces.component';



@NgModule({
  declarations: [
    WorkspacesComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    WorkspacesComponent
  ],
})
export class WorkspacesModule { }
