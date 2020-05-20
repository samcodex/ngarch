import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntilNgDestroy } from 'take-until-ng-destroy';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { NavigationItem } from './app-layout/arch-navigation/models/navigation-item-type';
import { SocketTasks } from '@core/models/socket-client.interface';
import { DashboardIndicator } from './dashboard/models/dashboard-indicator';
import { ProjectConfig, ProjectProfileService, isInvalidProjectConfig } from '@shared/project-profile';
import { CenterControllerService, ProjectStatus } from '@shared/services/center-controller/center-controller.service';
import { SocketHandlerService } from '@shared/services/socket-handler/socket-handler.service';

@Component({
  selector: 'arch-root',
  templateUrl: './arch.component.html',
  styleUrls: ['./arch.component.scss'],
  animations: [
    trigger('showHideDashboard', [
      state('show', style({
        opacity: 1,
        display: 'block'
      })),
      state('hide', style({
        opacity: 0.1,
        display: 'none'
      })),
      transition('show => hide', [
        animate('1s')
      ]),
      transition('hide => show', [
        animate('0.5s')
      ]),
    ]),
  ]
})
export class ArchComponent implements OnInit, OnDestroy {

  opened = true;
  selectedFeature: NavigationItem;

  useOverlay = false;

  hasWelcomePage = true;
  isServerError = false;

  hasDashboard = false;
  dashboardOpened = false;

  constructor(
    private centerController: CenterControllerService,
    private socket: SocketHandlerService,
    private profileService: ProjectProfileService,
    public dashboardIndicator: DashboardIndicator
  ) {

  }

  ngOnInit() {
    this.centerController.getProjectStatus()
      .pipe(
        takeUntilNgDestroy(this)
      )
      .subscribe(status => {
        if (status === ProjectStatus.UPDATING) {
          this.useOverlay = true;
        }
      });

    this.socket.listen(SocketTasks.OnError).subscribe( data => {
      this.isServerError = true;
      this.hasWelcomePage = true;
    });
    this.socket.listen(SocketTasks.OnOpen).subscribe( data => {
      this.isServerError = false;
    });

    this.profileService.getProjectConfig()
      .pipe(
        takeUntilNgDestroy(this)
      )
      .subscribe( (config: ProjectConfig) => {
        this.hasWelcomePage = isInvalidProjectConfig(config);

      // if (!this.hasWelcomePage) {
      //   this.subscription.unsubscribe();
      // }
    });

    this.dashboardIndicator.isIndicatorOpened()
      .subscribe((opened) => {
        this.dashboardOpened = opened;
      });
  }

  ngOnDestroy() {

  }


  closeOverlay($event) {
    this.useOverlay = false;
  }

  onToggleDashboard() {
    this.dashboardIndicator.next();
  }

  toggleExpandNavigation() {
    this.opened = !this.opened;
  }
}
