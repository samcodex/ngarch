import { Component, OnInit, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import {FormControl} from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { PonentDiagramDataService, PanelSession, PanelItem } from '../data-service/ponent-diagram-data.service';
import { ArchNgPonentLoadingGroup } from '../../shared/services/arch-ngponent-store';

@Component({
  selector: 'arch-module-ngponent-selector',
  templateUrl: './module-ngponent-selector.component.html',
  styleUrls: ['./module-ngponent-selector.component.scss']
})
export class ModuleNgponentSelectorComponent implements OnInit, OnDestroy {
  ponentItems: PanelSession[] = [];
  selectedItem: string;

  private subscription = new Subscription();

  constructor(
    private ponentDataService: PonentDiagramDataService
  ) {
  }

  ngOnInit() {
    this.subscription.add(this.ponentDataService.getPanelItems().subscribe(data => {
      this.ponentItems = data;
      this.ponentDataService.changeSelectedItem();
    }));
    this.subscription.add(this.ponentDataService.getSelectedItem().subscribe(item => this.selectedItem = item.value ));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  changeItem() {
    this.ponentDataService.changeSelectedItem(this.selectedItem);
  }
}
