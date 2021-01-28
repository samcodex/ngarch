import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntilNgDestroy } from 'take-until-ng-destroy';

import { UiElementItem, initUiElementItems } from '@core/models/ui-element-item';
import { MOKUAI_VIEWS } from '@ponent-mokuai/config/mokuai-views.config';
import { PonentMokuaiContextService } from '@ponent-mokuai/services/ponent-mokuai-context.service';

@Component({
  selector: 'arch-ponent-mokuai',
  templateUrl: './ponent-mokuai.component.html',
  styleUrls: ['./ponent-mokuai.component.scss'],
  providers: [ PonentMokuaiContextService ]
})
export class PonentMokuaiComponent implements OnInit, OnDestroy {

  mokuaiViews: UiElementItem[] = initUiElementItems(MOKUAI_VIEWS).filter(view => view.isUsed);

  constructor(
    private mokuaiContextService: PonentMokuaiContextService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.mokuaiContextService.getMokuaiContext()
      .pipe(
        takeUntilNgDestroy(this)
      )
      .subscribe(context => {
        this.updateSelectedTab(context.featureType, context.featureName, context.useSvgBoard);
      });
  }

  ngOnDestroy() {}

  onNavigate(data: UiElementItem, event: Event) {
    if (data.isSelected) {
      return ;
    } else {
      event.preventDefault();
    }

    const paths = this.extractSelectedTabPaths(data);
    const { path, value, isChecked, isCheckable } = data;
    const navigationOptions: NavigationExtras = { relativeTo: this.activatedRoute };
    if (isCheckable) {
      navigationOptions.queryParams = { board: 'SvgBoard'};
    }

    this.updateSelectedTab(path, value, isChecked);
    this.router.navigate(paths, navigationOptions)
      .then(() => {
        this.router.navigated = false;
      });
  }

  onCheckDetailOfTab(data: UiElementItem) {
    const paths = this.extractSelectedTabPaths(data);
    const options: NavigationExtras = { relativeTo: this.activatedRoute, replaceUrl: true };
    options.queryParams = data.isChecked ? { board: 'SvgBoard'} : null;

    this.router.navigate(paths, options);
  }

  private updateSelectedTab(featureType: string, featureName: string, isChecked: boolean) {
    this.mokuaiViews.forEach(view => {
      view.isSelected = view.path === featureType
        && (!featureName && !view.value || view.value === featureName);
      view.isChecked = view.isSelected && isChecked;
    });
  }

  private extractSelectedTabPaths(data: UiElementItem): string[] {
    const paths = [];
    const { path, value } = data;
    paths.push(path);
    if (value) {
      paths.push(value);
    }

    return paths;
  }
}
