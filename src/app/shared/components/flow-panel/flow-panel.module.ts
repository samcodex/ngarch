import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ResizableModule } from 'angular-resizable-element';
import { MovableModule } from 'ng2-movable';

import { FlowPanelComponent } from './flow-panel.component';

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
