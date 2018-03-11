import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ServiceDependencyComponent } from './service-dependency/service-dependency.component';
import { SharedModule } from './../shared/shared.module';
import { ServiceDependencyDataService } from './services/service-dependency-data.service';

const routes: Routes = [
  {
    path: '',
    component: ServiceDependencyComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule.forRoot()
  ],
  providers: [
    ServiceDependencyDataService
  ],
  declarations: [ServiceDependencyComponent]
})
export class ServiceDependencyModule { }
