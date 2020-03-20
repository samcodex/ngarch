import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { MatDividerModule } from '@angular/material/divider';

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
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [

      ]
    };
  }
}
