import { Injectable } from '@angular/core';
import { forEach } from 'lodash-es';
import { combineLatest, Observable, of, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { ArchNgPonent } from '@core/arch-ngponent';
import { DiagramOrganizer } from '@core/diagram/diagram-organizer';
import { PonentSelectOption, PonentSelectOptionGroup } from '../models/ponent-select.model';
import { ClassLevelPonentTypes } from '@core/ngponent-tsponent';
import { ArchNgPonentStore } from '@shared/arch-ngponent-store';

const defaultPanelSelectedItem: PonentSelectOptionGroup = {
  name: 'Overview',
  items: [
    {
      value: 'Overview',
      text: 'Modules & Components Overview',
      isDefault: true
    }
  ]
};

@Injectable()
export class PonentDiagramDataService {
  private panelSelectionItems: PonentSelectOptionGroup[] = [];
  private selectedPanelItem: PonentSelectOption;
  private selectedPanelItemSubject: ReplaySubject<PonentSelectOption> = new ReplaySubject<PonentSelectOption>(1);

  private currentPonentsSubject: ReplaySubject<ArchNgPonent[]> = new ReplaySubject(1);

  constructor(
    private store: ArchNgPonentStore,
    private organizer: DiagramOrganizer
  ) {
  }

  getCurrentArchNgPonents(): Observable<ArchNgPonent[]> {
    return this.currentPonentsSubject.asObservable();
  }

  getPonentsSelectionItems(): Observable<PonentSelectOptionGroup[]> {
    return combineLatest([
      of([defaultPanelSelectedItem]),
      this.store.getUsedPonentsGroupByLoadingModule()
    ])
    .pipe(
      map(([defaultGroup, data]) => {
        const archNgPonents = data.map( grouper =>
          (
            {
              name: grouper.ngPonentName,
              items: grouper.archNgPonents.map( archNgPonent =>
                (
                  {
                    archNgPonent: archNgPonent,
                    ngPonentType: archNgPonent.ngPonentType,
                    value: archNgPonent.name,
                    text: archNgPonent.name
                  }
                )
              )
            }
          )
        );

        this.panelSelectionItems = defaultGroup.concat(archNgPonents);

        return this.panelSelectionItems;
      })
    );
  }

  getSelectedPanelItem(): Observable<PonentSelectOption> {
    return this.selectedPanelItemSubject.asObservable();
  }

  private getPonentDiagramData(): Observable<ArchNgPonent[]> {
    const panelItem = this.selectedPanelItem;
    const isDirectedDependencies = false;

    if (panelItem) {
      const {archNgPonent, ngPonentType, value: ponentName} = panelItem;

      if (ponentName === 'Overview') {
        return this.store.getRootModulesOfLoadingGroup();
      } else {
        // if (archNgPonent.isRootOfLoadingGroup) {
        //   return this.store.findPonentAndDependenciesByName(ponentName);
        // } else
        if (ClassLevelPonentTypes.indexOf(ngPonentType) > -1) {
          return this.store.findPonentAndDependenciesByName(ponentName, isDirectedDependencies);
        }
      }
    }

    return Observable.create((observer) => {
      observer.next(null);
      observer.complete();
    });
  }

  changePonentSelection(selectedItem: PonentSelectOption | string = null): PonentSelectOption {
    let theItem: PonentSelectOption;

    if (!selectedItem) {
      theItem = defaultPanelSelectedItem.items[0];
    } else if (typeof selectedItem === 'string') {
      theItem = this.findPanelItem(selectedItem);
    } else {
      theItem = selectedItem;
    }
    this.selectedPanelItem = theItem;

    this.organizer.centerFirstNgPonent(false);
    const archPonent = this.selectedPanelItem.archNgPonent;
    if (archPonent) {
      if (!archPonent.isBootstrapModule) {
        this.organizer.centerFirstNgPonent(true);
      }
    }

    this.getPonentDiagramData().subscribe(data => {
      this.currentPonentsSubject.next(data);
    });

    this.selectedPanelItemSubject.next(this.selectedPanelItem);

    return this.selectedPanelItem;
  }

  private findPanelItem(id: string): PonentSelectOption {
    let panelItem: PonentSelectOption;

    forEach(this.panelSelectionItems, (group) => {
      panelItem = group.items.find( item => item.value === id );
      if (panelItem) {
        return false;
      }
    });

    return panelItem;
  }
}
