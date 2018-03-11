import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { PonentDiagramDataService } from '../data-service/ponent-diagram-data.service';

@Component({
  selector: 'arch-ponent-diagram-panel-tool-bar',
  templateUrl: './ponent-diagram-panel-tool-bar.component.html',
  styleUrls: ['./ponent-diagram-panel-tool-bar.component.scss']
})
export class PonentDiagramPanelToolBarComponent implements OnInit, OnDestroy {

  hasItemBackFlag = false;
  private subscriber: Subscription;

  constructor(
    private ponentDataService: PonentDiagramDataService,
  ) {

  }

  ngOnInit() {
    this.subscriber = this.ponentDataService.getItemStack().subscribe((stack) => {
      this.hasItemBackFlag = stack && stack.length > 0;
    });
  }

  ngOnDestroy() {
    this.subscriber.unsubscribe();
  }

  onHome() {
    this.ponentDataService.changeSelectedItem();
  }

  onBack() {
    if (this.hasItemBackFlag) {
      this.ponentDataService.backSelectedItem();
    }
  }
}
