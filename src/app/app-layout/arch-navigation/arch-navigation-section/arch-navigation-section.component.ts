import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { NavigationItem } from '../models/navigation-item-type';
import { DashboardIndicator } from './../../../dashboard/models/dashboard-indicator';

@Component({
  selector: 'arch-navigation-section',
  templateUrl: './arch-navigation-section.component.html',
  styleUrls: ['./arch-navigation-section.component.scss']
})
export class ArchNavigationSectionComponent implements OnInit {

  @Input()
  items: NavigationItem[];

  constructor(
    private router: Router,
    private dashboardIndicator: DashboardIndicator
  ) {
  }

  ngOnInit() {
    const path = window.location.pathname;
    const selectedItem = this.items.find( item => '/' + item.path === path);

    if (selectedItem) {
      this.changeItemState(selectedItem);
    }
  }

  selectItem(selectedItem: NavigationItem) {
    this.dashboardIndicator.close();
    this.changeItemState(selectedItem);
    const { path, dataKey, dataId, queryParams } = selectedItem;
    let navigatePath = '';
    const navigationQuery = queryParams ? { queryParams: queryParams, queryParamsHandling: 'merge' } : null as any;

    if (path) {
      const urlPath = Array.isArray(path) ? path.join('/') : path;
      navigatePath = dataKey && dataId ? `/${urlPath}/${dataKey}/${dataId}` : `/${urlPath}`;
    }

    if (navigatePath) {
      if (navigationQuery) {
        this.router.navigate([navigatePath], navigationQuery);
      } else {
        this.router.navigate([navigatePath]);
      }
    }
  }

  private changeItemState(selectedItem: NavigationItem) {
    this.items.forEach( item => item.isSelected = false);
    selectedItem.isSelected = true;
  }

}
