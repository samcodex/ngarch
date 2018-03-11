import { Component, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { AppStateService } from './shared/services/app-state/app-state.service';
import { NavigationItem } from './core/navigation-item-type';
import { ProjectLoaderOverlayComponent } from './project-loader-overlay/project-loader-overlay.component';
import { CenterControllerService, ProjectStatus } from './shared/services/center-controller/center-controller.service';

@Component({
  selector: 'arch-root',
  templateUrl: './arch.component.html',
  styleUrls: ['./arch.component.scss']
})
export class ArchComponent {
  opened = true;
  selectedFeature: NavigationItem;

  useOverlay = false;

  constructor(
    private appState: AppStateService,
    private centerController: CenterControllerService
  ) {
    this.centerController.getProjectStatus().subscribe(status => {
      if (status === ProjectStatus.UPDATING) {
        this.useOverlay = true;
      }
    });
  }

  closeOverlay($event) {
    this.useOverlay = false;
  }
}
