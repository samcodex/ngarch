import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArchRoutes } from './arch-navigation-setting';

@NgModule({
  imports: [RouterModule.forRoot(ArchRoutes, { useHash: true })],
  exports: [RouterModule]
})
export class ArchRoutingModule { }
