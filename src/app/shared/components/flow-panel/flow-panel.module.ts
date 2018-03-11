import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlowPanelComponent } from './flow-panel.component';
import { MovableModule } from 'ng2-movable';
import { ResizableModule } from 'angular-resizable-element';

@NgModule({
  imports: [
    CommonModule,
    MovableModule,
    ResizableModule
  ],
  declarations: [
    FlowPanelComponent
  ],
  exports: [
    FlowPanelComponent
  ]
})
export class FlowPanelModule {}
