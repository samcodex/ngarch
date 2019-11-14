import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { Observable, BehaviorSubject } from 'rxjs';

import { UiElementCategory, UiElementSection, UiElementData, findCategoryFromSection } from '@core/models/ui-element-category';
import { UiElementItem } from '@core/models/ui-element-item';
import { appViewerOptions } from '../../config/app-arch-viewer-config';
import { Orientation } from '@core/diagram/layout-options';
import { ArchViewerOptionCategory, ArchViewerNodeType, ArchViewerType, ArchViewerExtraContent, ArchViewerHierarchy } from '../../config/arch-viewer-definition';

const isItemChecked = (item: UiElementItem) => item.isChecked;

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

  constructor() {
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
        break;
      case ArchViewerOptionCategory.Orientation:
        this.viewerOrientation.next(option.value);
        break;
      case ArchViewerOptionCategory.TreeNodes:
        this.viewerNodeType.next(option.isChecked ? option.value : null);
        break;
      case ArchViewerOptionCategory.ViewerType:
        this.viewerType.next(option.isChecked ? option.value : null);
        break;
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

  private initViewerOptions() {
    const checkedHierarchy = this.findCheckedItem(ArchViewerOptionCategory.Hierarchy);
    this.viewerHierarchy.next(checkedHierarchy ? checkedHierarchy.value : null);

    const checkedOrientation = this.findCheckedItem(ArchViewerOptionCategory.Orientation);
    this.viewerOrientation.next(checkedOrientation ? checkedOrientation.value : null);

    const checkedTreeNode = this.findCheckedItem(ArchViewerOptionCategory.TreeNodes);
    this.viewerNodeType.next(checkedTreeNode ? checkedTreeNode.value : null);

    const checkedViewerType = this.findCheckedItem(ArchViewerOptionCategory.ViewerType);
    this.viewerType.next(checkedViewerType ? checkedViewerType.value : null);

    const checkedExtraContent = this.findCheckedItem(ArchViewerOptionCategory.ExtraService);
    this.viewerExtraContent.next(checkedExtraContent ? checkedExtraContent.value : null);
  }

  private findCheckedItem(type: ArchViewerOptionCategory): UiElementItem {
    const category = findCategoryFromSection(this.appViewerOptions, type);
    return category.items.find(isItemChecked);
  }
}
