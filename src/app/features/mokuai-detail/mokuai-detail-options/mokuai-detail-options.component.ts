import { Component, OnInit, OnDestroy } from '@angular/core';
import { takeUntilNgDestroy } from 'take-until-ng-destroy';

import { UiElementItem } from '@core/models/ui-element-item';
import { PonentMokuaiOptionsService } from '../services/ponent-mokuai-options.service';
import { MokuaiOptionCategories, MokuaiOptionCategory, MokuaiOptionCatType } from '../models/mokuai-option-model';
import { combineLatest } from 'rxjs';
import { MokuaiContext } from '@ponent-mokuai/models/mokuai-context';

@Component({
  selector: 'arch-mokuai-detail-options',
  templateUrl: './mokuai-detail-options.component.html',
  styleUrls: ['./mokuai-detail-options.component.scss']
})
export class MokuaiDetailOptionsComponent implements OnInit, OnDestroy {
  optionCategories: MokuaiOptionCategories;
  context: MokuaiContext;

  constructor(
    private optionsService: PonentMokuaiOptionsService
  ) { }

  ngOnInit() {
    const source = combineLatest([
      this.optionsService.getOptionCategories(),
      this.optionsService.getContext()
    ]);
    source
      .pipe(
        takeUntilNgDestroy(this)
      )
      .subscribe(([categories, context]) => {
        const available = categories.filter(category => !category.isDisabled);
        this.context = context;

        if (context.useSvgBoard) {
          this.optionCategories = available;
        } else {
          this.optionCategories = available.filter(category => category.type === MokuaiOptionCatType.Relationship);
        }
      });

    // this.optionsService.getOptionCategories()
    //   .pipe(
    //     takeUntilNgDestroy(this)
    //   )
    //   .subscribe(categories => {
    //     this.optionCategories = categories.filter(category => !category.isDisabled);
    //   });
  }

  ngOnDestroy() {}

  get hasDiagramIncludingSection() {
    return this.context && !!this.context.useSvgBoard;
  }

  filterUsedItem(item: UiElementItem) {
    return !!item.isUsed;
  }

  filterCategoryForRelationship(category: MokuaiOptionCategory) {
    return category.type === MokuaiOptionCatType.Relationship;
  }

  filterCategoryForNonRelationship(category: MokuaiOptionCategory) {
    return category.type !== MokuaiOptionCatType.Relationship;
  }

  onChangeOptionFilter(category: MokuaiOptionCategory, option: UiElementItem) {
    option.isChecked = !option.isChecked;
    // this.optionsService.updateOptionCategories(category, option);
    this.optionsService.updateOptionCategories();
  }

}
