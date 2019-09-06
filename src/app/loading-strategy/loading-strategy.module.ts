import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {
  MatExpansionModule,
  MatIconModule,
  MatFormFieldModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatInputModule
} from '@angular/material';

import { LoadingStrategyComponent } from './loading-strategy/loading-strategy.component';
import { SharedModule } from '../shared/shared.module';
import { LoadingGroupComponent } from './loading-group/loading-group.component';

const routes: Routes = [
  {
    path: '',
    component: LoadingStrategyComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,

    RouterModule.forChild(routes),
    SharedModule.forRoot()
  ],
  declarations: [
    LoadingStrategyComponent,
    LoadingGroupComponent
  ]
})
export class LoadingStrategyModule { }
