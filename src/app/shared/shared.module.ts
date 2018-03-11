import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewerHeaderComponent } from './components/viewer-header/viewer-header.component';
import { ViewerTerminalComponent } from './components/viewer-terminal/viewer-terminal.component';
import { CommaWithSpacePipe } from './components/comma-with-space/comma-with-space.pipe';

import { ProjectConfigService } from './services/project-config/project-config.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ViewerHeaderComponent,
    ViewerTerminalComponent,
    CommaWithSpacePipe
  ],
  exports: [
    ViewerHeaderComponent,
    ViewerTerminalComponent,
    CommaWithSpacePipe
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        ProjectConfigService
      ]
    };
  }
}
