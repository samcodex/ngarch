import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { AngularCliUsageComponent } from './angular-cli-usage/angular-cli-usage.component';
import { CliCommandComponent } from './cli-command/cli-command.component';
import { CliCommandPanelComponent } from './cli-command/cli-command-panel/cli-command-panel.component';
import { GenericCliExecComponent } from './generic-cli-exec/generic-cli-exec.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'angular-cli-usage',
    pathMatch: 'full'
  },
  {
    path: 'angular-cli-usage',
    component: AngularCliUsageComponent
  },
  {
    path: 'ng-cli-exec',
    component: CliCommandComponent
  },
  {
    path: 'generic-cli-exec',
    component: GenericCliExecComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    RouterModule.forChild(routes),
    SharedModule.forRoot()
  ],
  declarations: [
    AngularCliUsageComponent,
    CliCommandComponent,
    CliCommandPanelComponent,
    GenericCliExecComponent
  ]
})
export class ArchCliModule { }
