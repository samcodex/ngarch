import { Injectable, OnDestroy } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { Observable, ReplaySubject } from 'rxjs';
import { takeUntilNgDestroy } from 'take-until-ng-destroy';

import { MetaValue } from '@core/models/meta-data';
import { MokuaiOptionCategories, MokuaiOptionCatType } from '../models/mokuai-option-model';
import { viewerOptionCategories } from '../config/mokuai-viewer-options';
import { PonentMokuaiContextService } from '@ponent-mokuai/services/ponent-mokuai-context.service';
import { MokuaiContext } from '@ponent-mokuai/models/mokuai-context';

@Injectable()
export class PonentMokuaiOptionsService implements OnDestroy {
  private optionCategories: MokuaiOptionCategories = cloneDeep(viewerOptionCategories);

  private optionCategoriesStream = new ReplaySubject<MokuaiOptionCategories>(1);

  constructor(
    private ponentMokuaiContextService: PonentMokuaiContextService
  ) {
    this.initOptionCategories();
  }


  ngOnDestroy() {}

  updateOptionCategories() {
    this.optionCategoriesStream.next(this.optionCategories);
  }

  getOptionCategories(): Observable<MokuaiOptionCategories> {
    return this.optionCategoriesStream.asObservable();
  }

  getContext(): Observable<MokuaiContext> {
    return this.ponentMokuaiContextService.getMokuaiContext();
  }

  private initOptionCategories() {
    this.getContext()
      .pipe(
        takeUntilNgDestroy(this)
      )
      .subscribe(context => {
        const featureName = context.featureName;

        this.optionCategories.forEach((category, catIndex) => {
          if (category.type === MokuaiOptionCatType.Relationship) {
            category.items.forEach((item, itemIndex) => {
              if (featureName) {
                item.isUsed = item.value === featureName;
                item.isChecked = item.isDisabled = item.value === featureName;
              } else {
                const configItem = viewerOptionCategories[catIndex].items[itemIndex];
                item.isUsed = configItem.isUsed;
                item.isChecked = configItem.isChecked;
                item.isDisabled = configItem.isDisabled;
              }
            });
          } else {
            category.items.forEach(item => {
              if (category.type === MokuaiOptionCatType.Specific && item.value === MetaValue.Self) {
                item.name = context.viewerId;
                item.isDisabled = context.isOverview;
              }
            });
          }
        });

        this.updateOptionCategories();
      });
  }
}
