import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatGridListModule} from '@angular/material/grid-list';

import { DashboardComponent } from './dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { NgAppViewerModule } from 'app/ng-app-viewer/ng-app-viewer.module';
import { DashboardIndicator } from './models/dashboard-indicator';

@NgModule({
  imports: [
    CommonModule,
    MatGridListModule,
    RouterModule,

    SharedModule.forRoot(),
    NgAppViewerModule
  ],
  declarations: [
    DashboardComponent
  ],
  exports: [
    DashboardComponent
  ],
  providers: [
    DashboardIndicator
  ]
})
export class DashboardModule { }
