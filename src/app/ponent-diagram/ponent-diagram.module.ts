import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatFormFieldModule, MatSelectModule } from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { PonentDiagramComponent } from './ponent-diagram.component';
import { SharedModule } from '../shared/shared.module';
import { ModuleNgponentSelectorComponent } from './module-ngponent-selector/module-ngponent-selector.component';
import { PonentDiagramDataService } from './data-service/ponent-diagram-data.service';
import { FlowPanelModule } from '../shared/components/flow-panel/flow-panel.module';
import { PonentDiagramPanelToolBarComponent } from './ponent-diagram-panel-tool-bar/ponent-diagram-panel-tool-bar.component';

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
    FlowPanelModule
  ],
  declarations: [
    PonentDiagramComponent,
    ModuleNgponentSelectorComponent,
    PonentDiagramPanelToolBarComponent
  ],
  entryComponents: [
    ModuleNgponentSelectorComponent
  ],
  providers: [
    PonentDiagramDataService
  ]
})
export class PonentDiagramModule { }
