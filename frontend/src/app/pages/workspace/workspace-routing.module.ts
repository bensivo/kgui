import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabContentContainer } from 'src/app/components/tab-content/tabs.container';

const routes: Routes = [
  { path: '', component: TabContentContainer },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkspaceRoutingModule { }
