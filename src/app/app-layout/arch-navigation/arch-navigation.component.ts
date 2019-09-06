import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { cloneDeep } from 'lodash-es';
import { filter, map } from 'rxjs/operators';
import { takeUntilNgDestroy } from 'take-until-ng-destroy';

import { NavigationPaths } from '../../arch-routing.config';
import { NavigationSection } from './models/navigation-item-type';
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
        map((event: any) => event.urlAfterRedirects.split('/')[1]),
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

  private resetNavigationExpanded(path: string) {
    let hasAssigned = false;
    const pathChecker = (item) =>
      item.path === path || Array.isArray(item.path) && item.path.find(subPath => subPath === path);


    this.navigationSections.forEach(section => {
      const items = section.children;
      section.isExpanded = false;

      if (!hasAssigned && items.some(pathChecker)) {
        section.isExpanded = true;
        hasAssigned = true;
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
