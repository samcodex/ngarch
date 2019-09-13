import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { cloneDeep } from 'lodash-es';
import { filter, map } from 'rxjs/operators';
import { takeUntilNgDestroy } from 'take-until-ng-destroy';

import { NavigationPaths } from '../../arch-routing.config';
import { NavigationSection, NavigationItem } from './models/navigation-item-type';
import { ArchNgPonentStore } from '@shared/arch-ngponent-store';
import { appNavigationItems, navigationSections } from './models/arch-navigation-setting';

const isEnable = item => !item.hasOwnProperty('isDisabled') || !item.isDisabled;
const insert = (arr: Array<any>, newItems: Array<any>, index: number, replace = 0) => [
  ...arr.slice(0, index),
  ...newItems,
  ...arr.slice(index + replace)
];
const navigationSectionsTemplate = navigationSections
  .filter(isEnable)
  .map((section, index) => (
    {
      title: section.title,
      children: appNavigationItems.filter(item => isEnable(item) && item.category === section.category),
      isExpanded: index === 0
    }
  ))
;

@Component({
  selector: 'arch-navigation',
  templateUrl: './arch-navigation.component.html',
  styleUrls: ['./arch-navigation.component.scss']
})
export class ArchNavigationComponent implements OnInit, OnDestroy {

  navigationSections: Array<NavigationSection> = navigationSectionsTemplate;

  constructor(
    private router: Router,
    private store: ArchNgPonentStore
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(
        filter((event: any) => event instanceof NavigationEnd),
        map((event: any) => event.urlAfterRedirects),
        takeUntilNgDestroy(this)
      )
      .subscribe(this.resetNavigationExpanded.bind(this));

    this.store.getUsedPonentsGroupByLoadingModule()
      .pipe(
        map(groups => groups.map(ngPonent => ngPonent.ngPonentName)),
        takeUntilNgDestroy(this)
      )
      .subscribe(this.appendNavigationModuleItems.bind(this));
  }

  ngOnDestroy() {}

  private resetNavigationExpanded(appUrl: string) {
    const paths = appUrl.split('/');

    let hasAssigned = false;
    const checkForAppPath = (item: NavigationItem) => {
      const path = item.path;
      if (Array.isArray(path)) {
        return path.length + 1 === paths.length
          && path.reduce((acc, cur, idx) => acc && cur === paths[idx + 1], true);
      } else {
        return path === appUrl.split('/')[1];
      }
    };
    const checkForRestPath = (item: NavigationItem) => {
      const hasModuleKey = item.hasOwnProperty('dataKey');
      const hasModuleId = item.hasOwnProperty('dataId');
      const matchKey = hasModuleKey && paths.length > 2 && item.dataKey === paths[2];
      const matchId = hasModuleId && paths.length > 3 && item.dataId === paths[3];

      return !hasModuleKey || !hasModuleId || hasModuleKey && matchKey && hasModuleId && matchId;
    };

    this.navigationSections.forEach(section => {
      const navItems = section.children;

      section.isExpanded = false;
      navItems.forEach(child => child.isSelected = false);

      if (!hasAssigned && navItems.some(checkForAppPath)) {
        section.isExpanded = true;
        hasAssigned = true;

        const foundItem = section.children.find(child => checkForAppPath(child) && checkForRestPath(child));
        if (foundItem) {
          foundItem.isSelected = true;
        }
      }
    });
  }

  private appendNavigationModuleItems(moduleNames: string[]) {
    const FunctionalFlag = NavigationPaths.AnalysisModules;
    this.navigationSections = cloneDeep(navigationSectionsTemplate);

    this.navigationSections.forEach(section => {
      const children = section.children;
      const placeHolderIndex = children.findIndex(item => item.isPlaceHolder === true && item.path === FunctionalFlag);
      const placeHolderTemplate = children[placeHolderIndex];

      if (placeHolderIndex > -1) {
        const navItems = moduleNames.map(name => {
          const navItem = Object.assign({}, placeHolderTemplate);
          navItem.name = navItem.title = name.replace(/([A-Z])/g, ' $1').trim();
          navItem.isPlaceHolder = false;
          navItem.dataId = name;

          return navItem;
        });

        section.children = insert(children, navItems, placeHolderIndex, 1);
      }

      section.children = section.children.filter(item => item.isPlaceHolder !== true);
    });
  }
}
