import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TianHeaderComponent } from './tian-header/tian-header.component';
import { TianMainComponent } from './tian-main/tian-main.component';
import { TianSummaryComponent } from './tian-summary/tian-summary.component';
import { TianTitleComponent } from './tian-title/tian-title.component';
import { TianComponent } from './tian.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    TianComponent,
    TianHeaderComponent,
    TianMainComponent,
    TianTitleComponent,
    TianSummaryComponent
  ],
  exports: [
    TianComponent,
    TianHeaderComponent,
    TianMainComponent,
    TianTitleComponent,
    TianSummaryComponent
  ]
})
export class ArchTianModule { }
