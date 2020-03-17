import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PonentMokuaiRoutesComponent } from './components/ponent-mokuai-routes/ponent-mokuai-routes.component';
import { PonentMokuaiComponent } from './components/ponent-mokuai/ponent-mokuai.component';
import { MokuaiViewPaths } from './config/mokuai-views.config';

const routes: Routes = [
  {
    path: 'module/:moduleId',
    component: PonentMokuaiComponent,
    children: [
      {
        path: MokuaiViewPaths.Details,
        loadChildren: () => import('../features/mokuai-detail/mokuai-detail.module').then(m => m.MokuaiDetailModule)
      },
      {
        path: MokuaiViewPaths.Routes,
        component: PonentMokuaiRoutesComponent
      },
      {
        path: '',
        redirectTo: MokuaiViewPaths.Details,
        pathMatch: 'full',
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PonentMokuaiRoutingModule { }
