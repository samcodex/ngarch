import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, HostBinding, OnDestroy, OnInit, Output, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { takeUntilNgDestroy } from 'take-until-ng-destroy';

import { CenterControllerService, ProjectStatus } from '@shared/services/center-controller/center-controller.service';
import { SocketHandlerService } from '@shared/services/socket-handler/socket-handler.service';

@Component({
  selector: 'arch-project-loader-overlay',
  templateUrl: './project-loader-overlay.component.html',
  styleUrls: ['./project-loader-overlay.component.scss'],
  animations: [
    trigger('overlayAnimation', [
      transition('* => fadeIn', [
        style({ opacity: 0 }),
        animate(1000, style({ opacity: 0.5 }))
      ]),
      transition('* => fadeOut', [
        animate(1000, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ProjectLoaderOverlayComponent implements OnInit, OnDestroy {

  @HostBinding('@overlayAnimation') public overlayState = 'fadeOut';

  canClose = false;
  @Output() closeOverlay = new EventEmitter<boolean>();

  messages: string[] = [];

  constructor(
    private socketHandler: SocketHandlerService,
    private centerController: CenterControllerService
  ) {
  }

  ngOnInit() {
    this.messages.length = 0;

    this.socketHandler.listen('parsing_ponents')
      .pipe(
        takeUntilNgDestroy(this)
      )
      .subscribe((msg) => {
        this.messages.unshift(msg);
      });

    this.centerController.getProjectStatus()
      .pipe(
        takeUntilNgDestroy(this)
      )
      .subscribe( status => {
        if (status === ProjectStatus.UPDATING) {
          this.canClose = false;
        } else if (status === ProjectStatus.UPDATED) {
          this.canClose = true;
        }
      });
  }

  ngOnDestroy() {
    this.socketHandler.remove('parsing_ponents');
  }

  onClose() {
    this.closeOverlay.emit(true);
  }

  tryClose() {
    if (this.canClose) {
      this.onClose();
    }
  }
}
