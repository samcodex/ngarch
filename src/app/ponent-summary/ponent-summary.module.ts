import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDividerModule, MatExpansionModule, MatIconModule, MatListModule, MatNativeDateModule } from '@angular/material';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { PonentSummaryComponent } from './ponent-summary.component';
import { PonentSummaryService } from './services/ponent-summary.service';
import { SummarySectionComponent } from './summary-section/summary-section.component';

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
    MatNativeDateModule,
    MatDividerModule,
    MatListModule,
    MatTooltipModule,

    RouterModule.forChild(routes),
    SharedModule.forRoot()
  ],
  declarations: [PonentSummaryComponent, SummarySectionComponent],
  providers: [
    PonentSummaryService
  ]
})
export class PonentSummaryModule { }
