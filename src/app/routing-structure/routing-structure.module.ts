import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  MatDatepickerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatNativeDateModule,
} from '@angular/material';
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
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,

    SharedModule.forRoot()
  ],
  declarations: [
    RoutingStructureComponent
  ]
})
export class RoutingStructureModule { }
