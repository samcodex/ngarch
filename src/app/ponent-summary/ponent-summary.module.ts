import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  MatExpansionModule,
  MatIconModule,
  MatFormFieldModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatInputModule
} from '@angular/material';

import { PonentSummaryComponent } from './ponent-summary.component';
import { SummaryTableNgponentComponent } from './summary-table-ngponent/summary-table-ngponent.component';
import { SharedModule } from './../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: PonentSummaryComponent
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
  declarations: [PonentSummaryComponent, SummaryTableNgponentComponent]
})
export class PonentSummaryModule { }
