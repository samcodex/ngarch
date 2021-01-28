import { Injectable } from '@angular/core';
import { cloneDeep, get } from 'lodash-es';
import { BehaviorSubject, Observable, zip } from 'rxjs';

import { ArchNgPonent } from '@core/arch-ngponent/arch-ngponent';
import {
  ArchNgPonentLoadingGroup,
  ArchNgPonentStore,
  ArchLoadingAnalyzer,
  NgPonentAnalyzeType,
} from '@shared/arch-ngponent-store';
import { ProjectConfig, ProjectProfileService } from '@shared/project-profile';
import { IReloadable, ReloadRegisterService } from '@shared/reloadable';
import { SummaryData } from '../models/ponent-summary-config';
import { SummaryCategory, SummarySection } from '../models/ponent-summary.model';

@Injectable()
export class PonentSummaryService implements IReloadable {

  private projectConfig: ProjectConfig;
  private summaries: SummarySection[] = [...SummaryData];

  private summaryDataSubject: BehaviorSubject<SummarySection[]> = new BehaviorSubject<SummarySection[]>(this.summaries);

  constructor(
    private store: ArchNgPonentStore,
    private profileService: ProjectProfileService,
    private reloadRegister: ReloadRegisterService
  ) {
    this.reloadRegister.register(this);

    this.initSummarySubscription();
  }

  reload() {
    this.summaries = [...SummaryData];
  }

  getSummaryData(): Observable<SummarySection[]> {
    return this.summaryDataSubject.asObservable();
  }

  private initSummarySubscription() {

    zip(
      this.profileService.getProjectConfig(),
      this.store.getAllImportedPonentsGroupByLoadingModule(),
      this.store.getUnusedPonentsGroupByLoadingModule(),
      this.store.getUsedPonentsGroupByLoadingModule(),
      this.store.getRouteData()
    ).subscribe(data => {
      const [config, all, unused, used, routes] = data;

      this.projectConfig = config;

      this.updateWithAllImportedPonents(all);
      this.updateWithUnusedPonents(unused);
      this.updateForLoadingGroupsDetails(used);
      this.updateWithRouteDefinition(routes);

      this.summaryDataSubject.next(this.summaries);
    });
  }

  private updateWithAllImportedPonents(data: ArchNgPonentLoadingGroup[]) {
    const section = this.summaries.find(summary => summary.category === SummaryCategory.AllLoadingGroup);
    const [bootstrap, lazy] = section.details;
    const result = ArchLoadingAnalyzer.analyzeAngularLoadingGroups(data);
    const lazyDetail = section.items.find(item => item.name === 'LazyLoadingModules');

    if (result.lazyTotal > 0) {
      bootstrap.value = bootstrap.value.replace('#main', result.bootstrap.ngPonentName);
      lazy.value = lazy.value.replace('#lazyNumber', '' + result.lazyTotal);

      lazyDetail.value.length = 0;
      result.lazyModules.forEach(lazyModule => {
        lazyDetail.value.push({name: lazyModule.ngPonentName});
      });
    }

  }

  private updateWithUnusedPonents(data: ArchNgPonentLoadingGroup[]) {
    const section = this.summaries.find(summary => summary.category === SummaryCategory.IsolatedPonent);
    const [detail] = section.details;
    const result = ArchLoadingAnalyzer.analyzeIsolatedPonents(data);

    const {modules, services, components} = result;
    const total = modules.size + services.size + components.size;

    if (total > 0 ) {
      section.isDisable = false;
      detail.value = detail.value.replace('#total', '' + total);

      pushSectionWithAnalyzeType(section, result);
    }
  }

  private updateWithRouteDefinition(data: ArchNgPonent[]) {
    const section = this.summaries.find(summary => summary.category === SummaryCategory.RouteDefinition);
    const [detail] = section.details;

    if (data.length) {
      const [routes] = section.items;
      const srcPath = get(this.projectConfig.options, 'absolutePath.app');
      section.isDisable = false;
      detail.value = detail.value.replace('#routeNumber', '' + data.length);

      routes.value.length = 0;
      data.forEach(route => {
        routes.value.push({name: route.fileName.replace(srcPath, '.')});
      });
    }
  }

  private updateForLoadingGroupsDetails(data: ArchNgPonentLoadingGroup[]) {
    const bootstrap = this.summaries.find(summary => summary.category === SummaryCategory.BootstrapGroup);
    const lazyTemplate = this.summaries.find(summary => summary.category === SummaryCategory.LazyLoadingGroup);
    const lazyIndex = this.summaries.findIndex(summary => summary.category === SummaryCategory.LazyLoadingGroup);
    this.summaries.splice(lazyIndex, 1);

    data.forEach(group => {
      let copiedSection;
      if (group.isBootstrapGroup) {
        copiedSection = bootstrap;
      } else {
        copiedSection = cloneDeep(lazyTemplate);
        this.summaries.push(copiedSection);
      }

      if (copiedSection) {
        updateSectionWithLoadingGroup(copiedSection, group);
      }
    });
  }
}

function updateSectionWithLoadingGroup(section: SummarySection, group: ArchNgPonentLoadingGroup) {
    const groupResult = ArchLoadingAnalyzer.analyzeLoadingGroup(group);
    const {modules, services, components} = groupResult;
    const total = modules.size + services.size + components.size;
    const [detail] = section.details;
    detail.value = detail.value
      .replace('#moduleTotal', '' + modules.size)
      .replace('#serviceTotal', '' + services.size)
      .replace('#componentTotal', '' + components.size);

    section.isDisable = total === 0;
    section.title = group.ngPonentName;

    pushSectionWithAnalyzeType(section, groupResult);
  }

  function pushSectionWithAnalyzeType(section: SummarySection, data: NgPonentAnalyzeType) {
    const {modules, services, components} = data;
    const sectionModule = section.items.find(item => item.name === 'Modules');
    const sectionService = section.items.find(item => item.name === 'Services');
    const sectionComponent = section.items.find(item => item.name === 'Components');

    sectionModule.value.length = 0;
    sectionService.value.length = 0;
    sectionComponent.value.length = 0;

    modules.forEach(rstItem => {
      sectionModule.value.push({name: rstItem.name});
    });
    services.forEach(rstItem => {
      sectionService.value.push({name: rstItem.name});
    });
    components.forEach(rstItem => {
      sectionComponent.value.push({name: rstItem.name});
    });
  }
