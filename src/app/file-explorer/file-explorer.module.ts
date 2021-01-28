import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { TreeModule } from 'angular-tree-component';

import { SharedModule } from '../shared/shared.module';
import { ExplorerCanvasComponent } from './explorer-canvas/explorer-canvas.component';
import { FileExplorerComponent } from './file-explorer.component';
import { ExplorerDockComponent } from './explorer-dock/explorer-dock.component';

const routes: Routes = [
  {
    path: '',
    component: FileExplorerComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    MatSidenavModule,
    RouterModule.forChild(routes),
    SharedModule.forRoot(),
    TreeModule.forRoot()
  ],
  declarations: [
    ExplorerCanvasComponent,
    FileExplorerComponent,
    ExplorerDockComponent,
  ]
})
export class FileExplorerModule { }
