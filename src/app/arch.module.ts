import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppHeaderComponent } from './app-layout/app-header/app-header.component';
import { ArchHeaderComponent } from './app-layout/arch-header/arch-header.component';
import { ArchNavigationSectionComponent } from './app-layout/arch-navigation/arch-navigation-section/arch-navigation-section.component';
import { ArchNavigationComponent } from './app-layout/arch-navigation/arch-navigation.component';
import { ProjectConfigDialogComponent } from './app-layout/project-config-dialog/project-config-dialog.component';
import { ProjectLoaderOverlayComponent } from './app-layout/project-loader-overlay/project-loader-overlay.component';
import { WelcomePageComponent } from './app-layout/welcome-page/welcome-page.component';
import { ArchRoutingModule } from './arch-routing.module';
import { ArchComponent } from './arch.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { ProjectProfileService } from './shared/project-profile';
import { ReloadRegisterService } from './shared/reloadable/reload-register.service';
import { ArchConfigService } from './shared/services/arch-config/arch-config.service';
import { CenterControllerService } from './shared/services/center-controller/center-controller.service';
import { RestService } from './shared/services/rest/rest.service';
import { SocketClientService } from './shared/services/socket-client/socket-client.service';
import { SocketHandlerService } from './shared/services/socket-handler/socket-handler.service';
import { WebSocketClientService } from './shared/services/web-socket-client/web-socket-client.service';
import { SharedModule } from './shared/shared.module';
import { ArchHelpComponent } from './app-layout/arch-help/arch-help.component';
import { ArchNgPonentStore } from '@shared/arch-ngponent-store/arch-ngponent-store';
import { WINDOW_PROVIDERS } from './arch.env';

@NgModule({
  declarations: [
    ArchComponent,
    ArchHeaderComponent,
    AppHeaderComponent,
    ArchNavigationComponent,
    ProjectConfigDialogComponent,
    ProjectLoaderOverlayComponent,
    WelcomePageComponent,
    ArchNavigationSectionComponent,
    ArchHelpComponent
  ],
  entryComponents: [
    ProjectConfigDialogComponent,
    ArchHelpComponent
  ],
  imports: [
    CdkTableModule,
    CdkTreeModule,

    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      iconClasses: { info: 'arch-toast-tips' },
      preventDuplicates: true
    }),

    SharedModule.forRoot(),

    ArchRoutingModule,
    DashboardModule
  ],
  providers: [
    WINDOW_PROVIDERS,
    SocketClientService,
    WebSocketClientService,
    SocketHandlerService,
    ArchConfigService,
    ReloadRegisterService,
    CenterControllerService,
    RestService,
    ProjectProfileService,
    ArchNgPonentStore
  ],
  bootstrap: [ArchComponent]
})
export class ArchModule { }
