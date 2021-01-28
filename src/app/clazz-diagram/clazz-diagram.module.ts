import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ClazzDiagramComponent } from './clazz-diagram.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: ClazzDiagramComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule.forRoot()
  ],
  declarations: [ClazzDiagramComponent]
})
export class ClazzDiagramModule { }
