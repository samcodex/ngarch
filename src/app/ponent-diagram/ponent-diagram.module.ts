import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { DiagramOrganizer } from '../core/diagram/diagram-organizer';
import { FlowPanelModule } from '../shared/components/flow-panel/flow-panel.module';
import { SharedModule } from '../shared/shared.module';
import { PonentDiagramDataService } from './data-service/ponent-diagram-data.service';
import { PonentDiagramComponent } from './ponent-diagram.component';

const routes: Routes = [
  {
    path: '',
    component: PonentDiagramComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule.forRoot(),

    FormsModule,
    ReactiveFormsModule,
    FlowPanelModule,
  ],
  declarations: [
    PonentDiagramComponent
  ],
  providers: [
    PonentDiagramDataService,
    DiagramOrganizer
  ]
})
export class PonentDiagramModule { }
