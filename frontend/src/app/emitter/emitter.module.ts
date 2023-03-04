import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EmitterService } from './emitter.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    EmitterService,
  ],
})
export class EmitterModule { }

