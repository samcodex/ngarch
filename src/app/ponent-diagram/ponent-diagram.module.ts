import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatSelectModule, MatTooltipModule } from '@angular/material';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    FlowPanelModule,
    MatCheckboxModule,
    MatTooltipModule
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
