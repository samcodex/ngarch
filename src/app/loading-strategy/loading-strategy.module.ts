import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

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

    RouterModule.forChild(routes),
    SharedModule.forRoot()
  ],
  declarations: [
    LoadingStrategyComponent,
    LoadingGroupComponent
  ]
})
export class LoadingStrategyModule { }
