import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArchTabsComponent } from './arch-tabs/arch-tabs.component';
import { ArchTabComponent } from './arch-tab/arch-tab.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ArchTabsComponent, ArchTabComponent],
  exports: [ArchTabsComponent, ArchTabComponent]
})
export class ArchTabsModule { }
