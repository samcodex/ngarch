import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { RoutingStructureComponent } from './routing-structure.component';

const routes: Routes = [
  {
    path: '',
    component: RoutingStructureComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

    SharedModule.forRoot()
  ],
  declarations: [
    RoutingStructureComponent
  ]
})
export class RoutingStructureModule { }
