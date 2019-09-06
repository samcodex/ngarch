import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule,
} from '@angular/material';

import { CallbackPipe } from './components/callback/callback.pipe';
import { CommaWithSpacePipe } from './components/comma-with-space/comma-with-space.pipe';
import { LoadingBarComponent } from './components/loading-bar/loading-bar.component';
import { NameValueListComponent } from './components/name-value-list/name-value-list.component';
import { ViewerHeaderComponent } from './components/viewer-header/viewer-header.component';
import { ViewerTerminalComponent } from './components/viewer-terminal/viewer-terminal.component';
import { ArchTianModule } from './arch-tian/arch-tian.module';
import { ArchTabsModule } from './arch-tabs/arch-tabs.module';
import { FlowDropDownComponent } from './components/flow-drop-down/flow-drop-down.component';
import { CliOptionCardComponent } from './components/cli/cli-option-card/cli-option-card.component';
import { CliOptionInputComponent } from './components/cli/cli-option-input/cli-option-input.component';
import { CliExecutionComponent } from './components/cli/cli-execution/cli-execution.component';
import { CliCommandLineComponent } from './components/cli/cli-command-line/cli-command-line.component';
import { GenericOptionComponent } from './components/generic-option-panel/generic-option/generic-option.component';
import { PrismCoderComponent } from './components/prism-coder/prism-coder.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule
  ],
  declarations: [
    ViewerHeaderComponent,
    ViewerTerminalComponent,
    CommaWithSpacePipe,
    NameValueListComponent,
    CallbackPipe,
    LoadingBarComponent,
    FlowDropDownComponent,
    CliOptionCardComponent,
    CliOptionInputComponent,
    CliExecutionComponent,
    CliCommandLineComponent,
    GenericOptionComponent,
    PrismCoderComponent
  ],
  exports: [
    ViewerHeaderComponent,
    ViewerTerminalComponent,
    CommaWithSpacePipe,
    NameValueListComponent,
    CallbackPipe,
    LoadingBarComponent,
    FlowDropDownComponent,
    ArchTianModule,
    ArchTabsModule,
    CliOptionCardComponent,
    CliOptionInputComponent,
    CliExecutionComponent,
    CliCommandLineComponent,
    GenericOptionComponent,
    PrismCoderComponent
  ],
  entryComponents: [
    CliExecutionComponent
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [

      ]
    };
  }
}
