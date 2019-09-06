import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ArchDropdownComponent,
  ArchDropdownOptionDirective,
  ArchDropdownThumbnailDirective
} from './arch-dropdown/arch-dropdown.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ArchDropdownComponent,
    ArchDropdownOptionDirective,
    ArchDropdownThumbnailDirective
  ],
  exports: [
    ArchDropdownComponent,
    ArchDropdownOptionDirective,
    ArchDropdownThumbnailDirective
  ]
})
export class ArchDropdownModule { }
