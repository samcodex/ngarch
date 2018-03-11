import { Injectable, NgModule } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { forEach } from 'lodash';

import { ArchNgPonentStore, ArchNgPonentLoadingGroup } from '../../shared/services/arch-ngponent-store';
import { ArchNgPonent } from '../../core/arch-ngponent';
import { NgPonentFeature, ClassLevelPonentTypes, NgPonentType, PonentsRelation } from '../../core/ngponent-tsponent';

@Injectable()
export class PonentDiagramDataService {
  private panelItems: PanelSession[] = [];
  private selectedItems: PanelItem[] = [];
  private selectedPanelItem: PanelItem;

  private panelItemsSubject: ReplaySubject<PanelSession[]> = new ReplaySubject(1);
  private currentPonentsSubject: ReplaySubject<ArchNgPonent[]> = new ReplaySubject(1);
  private selectedItemSubject: ReplaySubject<PanelItem> = new ReplaySubject(1);
  private itemStackSubject: ReplaySubject<PanelItem[]> = new ReplaySubject(1);

  constructor(
    private store: ArchNgPonentStore
  ) {
    this.setPanelItemsListener();
  }

  private resetData() {
    this.panelItems.length = 0;
    this.selectedItems.length = 0;
    this.selectedPanelItem = null;
  }

  getPanelItems(): Observable<PanelSession[]> {
    return this.panelItemsSubject.asObservable();
  }

  getSelectedItem(): Observable<PanelItem> {
    return this.selectedItemSubject.asObservable();
  }

  getCurrentArchNgPonents(): Observable<ArchNgPonent[]> {
    return this.currentPonentsSubject.asObservable();
  }

  getItemStack(): Observable<PanelItem[]> {
    return this.itemStackSubject.asObservable();
  }

  private setPanelItemsListener() {
    this.store.getPonentsGroupByLoadingModule().subscribe((data) => {
      const defaultItems = this.getDefaultItems();

      const archNgPonents = data.map( grouper =>
        (
          {
            name: grouper.ngPonentName,
            items: grouper.archNgPonents.map( archNgPonent =>
              (
                {
                  ngPonentType: archNgPonent.ngPonentType,
                  features: archNgPonent.ngPonentFeatures,
                  value: archNgPonent.name,
                  text: archNgPonent.name
                }
              )
            )
          }
        )
      );

      this.resetData();

      this.panelItems.push.apply(this.panelItems, defaultItems);
      this.panelItems.push.apply(this.panelItems, archNgPonents);

      this.panelItemsSubject.next(this.panelItems);
    });
  }

  private getPonentDiagramData(): Observable<ArchNgPonent[]> {
    const panelItem = this.selectedPanelItem;

    if (panelItem) {
      const ponentName = panelItem.value;

      if (ponentName === 'Overview') {
        return this.store.getAllArchNgModules();
      } else {
        const ngPonentType = panelItem.ngPonentType;
        const features = panelItem.features;

        if (features &&
          (features.indexOf(NgPonentFeature.LazyLoading) > -1 ||
          features.indexOf(NgPonentFeature.BootstrapModule) > -1)
        ) {
          return this.store.getPonentsByLoadingModule(ponentName);
        } else if (ClassLevelPonentTypes.indexOf(ngPonentType) > -1) {
          return this.store.getModuleTypePonentByName(ponentName);
        }
      }
    }

    return Observable.create((observer) => {
      observer.next(null);
      observer.complete();
    });
  }

  backSelectedItem() {
    if (this.selectedItems.length) {
      this.selectedPanelItem = this.selectedItems.pop();

      this.selectedItemSubject.next(this.selectedPanelItem);
      this.itemStackSubject.next(this.selectedItems);
      this.updateArchNgPonents();
    }
  }

  /**
   * Main entry to change ponent-diagram data
   * @param selectedItem
   */
  changeSelectedItem(selectedItem: PanelItem | string = null) {
    let theItem: PanelItem;
    let isClickHome = false;

    if (!selectedItem) {
      isClickHome = true;
      theItem = this.getDefaultItem();
    } else if (typeof selectedItem === 'string') {
      theItem = this.findPanelItem(selectedItem);
    } else {
      theItem = selectedItem;
    }

    if (this.selectedPanelItem) {
      if (this.selectedPanelItem.value === theItem.value || isClickHome) {
        this.selectedItems.length = 0;
      } else {
        this.selectedItems.push(this.selectedPanelItem);
      }
      this.itemStackSubject.next(this.selectedItems);
    }
    this.selectedPanelItem = theItem;
    this.selectedItemSubject.next(this.selectedPanelItem);

    this.updateArchNgPonents();
  }

  updateArchNgPonents() {
    this.getPonentDiagramData().subscribe(data => {
      this.currentPonentsSubject.next(data);
    });
  }

  private findPanelItem(id: string): PanelItem {
    let panelItem: PanelItem;

    forEach(this.panelItems, (group) => {
      panelItem = group.items.find( item => item.value === id );
      if (panelItem) {
        return false;
      }
    });

    return panelItem;
  }

  private getDefaultItems(): PanelSession[] {
    return [
      {
        name: 'Overview',
        items: [
          {
            value: 'Overview',
            text: 'Modules & Components Overview'
          }
        ]
      }
    ];
  }

  private getDefaultItem(): PanelItem {
    return this.getDefaultItems()[0].items[0];
  }
}


export interface PanelSession {
  name: string;
  items: PanelItem[];
}

export interface PanelItem {
  value: string;
  text: string;
  ngPonentType?: NgPonentType;
  features?: NgPonentFeature[];
}
