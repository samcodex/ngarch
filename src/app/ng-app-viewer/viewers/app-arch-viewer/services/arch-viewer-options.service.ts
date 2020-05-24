import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { map, filter } from 'rxjs/operators';

import { UiElementCategory, UiElementSection, UiElementData, findCategoryFromSection, checkCategoryItemWithValue } from '@core/models/ui-element-category';
import { UiElementItem } from '@core/models/ui-element-item';
import { appViewerOptions } from '../../config/app-arch-viewer-config';
import { Orientation } from '@core/diagram/layout-options';
import { ArchViewerOptionCategory, ArchViewerNodeType, ArchViewerType, ArchViewerExtraContent, ArchViewerHierarchy } from '../../config/arch-viewer-definition';

@Injectable({
  providedIn: 'root'
})
export class ArchViewerOptionsService {

  private appViewerOptions: UiElementData = cloneDeep(appViewerOptions);

  private viewerHierarchy: BehaviorSubject<ArchViewerHierarchy> = new BehaviorSubject(ArchViewerHierarchy.FullView);
  private viewerOrientation: BehaviorSubject<Orientation> = new BehaviorSubject(Orientation.TopToBottom);
  private viewerNodeType: BehaviorSubject<ArchViewerNodeType> = new BehaviorSubject(null);
  private viewerType: BehaviorSubject<ArchViewerType> = new BehaviorSubject(ArchViewerType.RoutesTree);
  private viewerExtraContent: BehaviorSubject<ArchViewerExtraContent> = new BehaviorSubject(null);

  private changeFromService = true;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.initViewerOptions();
  }

  getOptionDataForRuntimeStructure(): UiElementData {
    return this.appViewerOptions;
  }

  getOptionDataForModuleStructure(): UiElementData {
    const optionsConfig = [ [ 'options', ArchViewerOptionCategory.Orientation ]];
    const options = optionsConfig.map((config: [string, string]) => {
      const found = this.appViewerOptions.find(section => section.id === config[0]);
      if (found) {
        found.categories = found.categories.filter(category => category.type === config[1]);
      }
      return found;
    });

    return options;
  }

  changeOption(section: UiElementSection, category: UiElementCategory<ArchViewerOptionCategory>, option: UiElementItem): void {
    const categoryType = category.type;
    switch (categoryType) {
      case ArchViewerOptionCategory.Hierarchy:
        this.viewerHierarchy.next(option.value);
        this.router.navigate(['../', option.value], { relativeTo: this.activatedRoute});
        this.changeFromService = true;
        break;
      case ArchViewerOptionCategory.Orientation:
        this.viewerOrientation.next(option.value);
        break;
      // case ArchViewerOptionCategory.TreeNodes:
      //   this.viewerNodeType.next(option.isChecked ? option.value : null);
      //   break;
      // case ArchViewerOptionCategory.ViewerType:
      //   this.viewerType.next(option.isChecked ? option.value : null);
      //   break;
      case ArchViewerOptionCategory.ExtraService:
        this.viewerExtraContent.next(option.isChecked ? option.value : null);
        break;
      default:
    }
  }

  getViewerHierarchy(): Observable<ArchViewerHierarchy> {
    return this.viewerHierarchy.asObservable();
  }

  getViewerOrientation(): Observable<Orientation> {
    return this.viewerOrientation.asObservable();
  }

  getViewerNodeType(): Observable<ArchViewerNodeType> {
    return this.viewerNodeType.asObservable();
  }

  getViewerType(): Observable<ArchViewerType> {
    return this.viewerType.asObservable();
  }

  getViewerExtraContent(): Observable<ArchViewerExtraContent> {
    return this.viewerExtraContent.asObservable();
  }

  private initOptionsFromHierarchy(hierarchy: ArchViewerHierarchy, orientation = Orientation.TopToBottom) {
    const checkedHierarchy = this.findCheckedItem(ArchViewerOptionCategory.Hierarchy, hierarchy);
    this.viewerHierarchy.next(checkedHierarchy ? checkedHierarchy.value : null);

    const checkedOrientation = this.findCheckedItem(ArchViewerOptionCategory.Orientation, orientation);
    this.viewerOrientation.next(checkedOrientation ? checkedOrientation.value : null);

    // const checkedTreeNode = this.findCheckedItem(ArchViewerOptionCategory.TreeNodes);
    // this.viewerNodeType.next(checkedTreeNode ? checkedTreeNode.value : null);

    // const checkedViewerType = this.findCheckedItem(ArchViewerOptionCategory.ViewerType);
    // this.viewerType.next(checkedViewerType ? checkedViewerType.value : null);

    const checkedExtraContent = this.findCheckedItem(ArchViewerOptionCategory.ExtraService);
    this.viewerExtraContent.next(checkedExtraContent ? checkedExtraContent.value : null);
  }

  private initViewerOptions() {
    const hierarchy = this.activatedRoute.snapshot.paramMap.get('hierarchy');
    this.initOptionsFromHierarchy(hierarchy as any);
    this.changeFromService = true;

    if (hierarchy) {
      this.listenParamHierarchy();
    }
  }

  private listenParamHierarchy() {
    this.activatedRoute.paramMap
    .pipe(
      filter(() => {
        const passed = !this.changeFromService;
        this.changeFromService = false;
        return passed;
      }),
      map(params => params.get('hierarchy')),
      // distinctUntilChanged()
    )
    .subscribe(hierarchy => {
      this.initOptionsFromHierarchy(hierarchy as any);
    });
  }

  private findCheckedItem(type: ArchViewerOptionCategory, itemValue?: string): UiElementItem {
    const category = findCategoryFromSection(this.appViewerOptions, type);
    return checkCategoryItemWithValue(category, itemValue);
  }
}
