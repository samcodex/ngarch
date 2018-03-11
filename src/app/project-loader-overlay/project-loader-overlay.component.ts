import { Component, OnInit, OnDestroy, Output,
  HostBinding, ViewContainerRef, Input, EventEmitter } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import { Subscription } from 'rxjs/Subscription';
import { SocketHandlerService } from './../shared/services/socket-handler/socket-handler.service';
import { CenterControllerService, ProjectStatus } from '../shared/services/center-controller/center-controller.service';

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
  subscription: Subscription;

  constructor(
    private socketHandler: SocketHandlerService,
    private viewContainerRef: ViewContainerRef,
    private centerController: CenterControllerService
  ) {
  }

  ngOnInit() {
    this.messages.length = 0;

    this.subscription = this.socketHandler.listen('parsing_ponents').subscribe((msg) => {
      this.messages.unshift(msg);
    });

    this.centerController.getProjectStatus().subscribe( status => {
      if (status === ProjectStatus.UPDATING) {
        this.canClose = false;
      } else if (status === ProjectStatus.UPDATED) {
        this.canClose = true;
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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
