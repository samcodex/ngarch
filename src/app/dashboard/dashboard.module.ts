import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatGridListModule} from '@angular/material/grid-list';

import { DashboardComponent } from './dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { BoardTileComponent } from './board-tile/board-tile.component';

@NgModule({
  imports: [
    CommonModule,
    MatGridListModule,

    SharedModule.forRoot()
  ],
  declarations: [
    DashboardComponent,
    BoardTileComponent
  ],
  exports: [
    DashboardComponent
  ]
})
export class DashboardModule { }
