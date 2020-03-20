import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '@shared/shared.module';
import { MokuaiDetailOptionsComponent } from './mokuai-detail-options/mokuai-detail-options.component';
import { MokuaiDetailComponent } from './mokuai-detail/mokuai-detail.component';
import { MetaValue } from '@core/models/meta-data';

const routes: Routes = [
  {
    path: '',
    component: MokuaiDetailComponent,
  },
  {
    path: MetaValue.Dependency,
    component: MokuaiDetailComponent,
  },
  {
    path: MetaValue.Composition,
    component: MokuaiDetailComponent,
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule.forRoot(),
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [MokuaiDetailOptionsComponent, MokuaiDetailComponent]
})
export class MokuaiDetailModule { }
