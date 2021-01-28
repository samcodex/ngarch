import { Router } from '@angular/router';

import { DashboardIndicator } from './models/dashboard-indicator';
import { Component, OnInit } from '@angular/core';

const mapOfRoutePath = {
  'overview': '/ng-app-viewer/viewer/app-arch/FullView',
  'injector': '/ng-app-viewer/viewer/app-arch/InjectorHierarchy',
  'module': '/ng-app-viewer/viewer/module-struct',
  'component': '/ng-app-viewer/viewer/component-hierarchy',
  'routing': '/ng-app-viewer/viewer/routing-hierarchy'
};

@Component({
  selector: 'arch-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private router: Router,
    private indicator: DashboardIndicator
  ) { }

  ngOnInit() {
  }

  navigateTo(pathName: string) {
    const path = mapOfRoutePath[pathName];
    if (path) {
      this.indicator.close();
      this.router.navigate([path]);
    }
  }
}
