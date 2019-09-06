import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ArchRoutes } from './arch-routing.config';

@NgModule({
  imports: [RouterModule.forRoot(ArchRoutes, { useHash: true })],
  exports: [RouterModule]
})
export class ArchRoutingModule { }
