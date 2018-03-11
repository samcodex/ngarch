import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CdkTableModule} from '@angular/cdk/table';
import { MatSidenavModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatNativeDateModule,
  MatDialogModule
} from '@angular/material';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from './shared/shared.module';

import { ArchRoutingModule } from './arch-routing.module';

import { ArchComponent } from './arch.component';
import { ArchHeaderComponent } from './arch-header/arch-header.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { ArchNavigationComponent } from './arch-navigation/arch-navigation.component';
import { ProjectConfigDialogComponent } from './project-config-dialog/project-config-dialog.component';
import { ProjectLoaderOverlayComponent } from './project-loader-overlay/project-loader-overlay.component';
import { ArchNgPonentStore } from './shared/services/arch-ngponent-store';
import { PonentLoaderService } from './shared/services/ponent-loader/ponent-loader.service';
import { ProjectInfoService } from './shared/services/project-info/project-info.service';
import { SocketClientService } from './shared/services/socket-client/socket-client.service';
import { WebSocketClientService } from './shared/services/web-socket-client/web-socket-client.service';
import { SocketHandlerService } from './shared/services/socket-handler/socket-handler.service';
import { AppStateService } from './shared/services/app-state/app-state.service';
import { ArchConfigService } from './shared/services/arch-config/arch-config.service';
import { ProjectFilesService } from './shared/services/project-files/project-files.service';
import { ReloadRegisterService } from './shared/reloadable/reload-register.service';
import { CenterControllerService } from './shared/services/center-controller/center-controller.service';
import { RestService } from './shared/services/rest/rest.service';

@NgModule({
  declarations: [
    ArchComponent,
    ArchHeaderComponent,
    AppHeaderComponent,
    ArchNavigationComponent,
    ProjectConfigDialogComponent,
    ProjectLoaderOverlayComponent,
  ],
  entryComponents: [
    ProjectConfigDialogComponent
  ],
  imports: [
    MatSidenavModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatNativeDateModule,
    MatDialogModule,

    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    SharedModule.forRoot(),

    ArchRoutingModule
  ],
  providers: [
    SocketClientService,
    WebSocketClientService,
    SocketHandlerService,

    AppStateService,
    PonentLoaderService,

    ArchNgPonentStore,
    ProjectInfoService,
    ArchConfigService,
    ProjectFilesService,
    ReloadRegisterService,
    CenterControllerService,
    RestService
  ],
  bootstrap: [ArchComponent]
})
export class ArchModule { }
