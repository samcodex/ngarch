import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatIconModule, MatSelectModule, MatTabsModule, MatTooltipModule } from '@angular/material';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';

import { SharedModule } from '@shared/shared.module';
import { PonentMokuaiComponent } from './components/ponent-mokuai/ponent-mokuai.component';
import { PonentMokuaiRoutesComponent } from './components/ponent-mokuai-routes/ponent-mokuai-routes.component';
import { PonentMokuaiRoutingModule } from './ponent-mokuai-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule.forRoot(),
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatTabsModule,
    MatIconModule,
    MatMenuModule,

    PonentMokuaiRoutingModule
  ],
  declarations: [PonentMokuaiComponent, PonentMokuaiRoutesComponent ]
})
export class PonentMokuaiModule { }
