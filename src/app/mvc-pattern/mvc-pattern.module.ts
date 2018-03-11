import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MvcPatternComponent } from './mvc-pattern/mvc-pattern.component';
import { SharedModule } from './../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: MvcPatternComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule.forRoot()
  ],
  declarations: [MvcPatternComponent]
})
export class MvcPatternModule { }
