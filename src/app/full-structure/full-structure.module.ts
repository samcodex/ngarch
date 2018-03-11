import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { FullStructureComponent } from './full-structure.component';

const routes: Routes = [
  {
    path: '',
    component: FullStructureComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FullStructureComponent],
  providers: [

  ]
})
export class FullStructureModule { }
