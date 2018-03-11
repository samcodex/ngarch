import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';


import { NavigationItem } from './../../../core/navigation-item-type';

@Injectable()
export class AppStateService {

  private selectedNavigationItem: NavigationItem;

  constructor() {

  }

  setSelectedNavigationItem(item: NavigationItem) {
    this.selectedNavigationItem = item;
  }
}
