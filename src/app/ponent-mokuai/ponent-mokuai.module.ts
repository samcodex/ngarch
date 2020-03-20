import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@shared/shared.module';
import { PonentMokuaiComponent } from './components/ponent-mokuai/ponent-mokuai.component';
import { PonentMokuaiRoutesComponent } from './components/ponent-mokuai-routes/ponent-mokuai-routes.component';
import { PonentMokuaiRoutingModule } from './ponent-mokuai-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,

    PonentMokuaiRoutingModule
  ],
  declarations: [PonentMokuaiComponent, PonentMokuaiRoutesComponent ]
})
export class PonentMokuaiModule { }
