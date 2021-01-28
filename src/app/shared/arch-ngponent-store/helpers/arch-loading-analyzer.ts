import { isArchService } from '@core/arch-ngponent';
import { ArchNgPonent } from '@core/arch-ngponent/arch-ngponent';
import { NgPonentType } from '@core/ngponent-tsponent/ngponent-definition';
import { ArchNgPonentLoadingGroup } from '../models/arch-loading-group';

interface LoadingAnalyzeType {
  bootstrap: ArchNgPonentLoadingGroup;
  lazyTotal: number;
  lazyModules: ArchNgPonentLoadingGroup[];
}

export interface NgPonentAnalyzeType {
  modules: Set<ArchNgPonent>;
  services: Set<ArchNgPonent>;
  components: Set<ArchNgPonent>;
}

const moduleTypePonents = [ NgPonentType.NgModule, NgPonentType.ModuleWithProviders ];

export const ArchLoadingAnalyzer = {

  analyzeAngularLoadingGroups(groups: ArchNgPonentLoadingGroup[]): LoadingAnalyzeType {
    const result: LoadingAnalyzeType = {
      bootstrap: null,
      lazyTotal: 0,
      lazyModules: []
    };

    groups.forEach(group => {
      if (group.isBootstrapGroup) {
        result.bootstrap = group;
      } else {
        ++ result.lazyTotal;
        result.lazyModules.push(group);
      }
    });

    return result;
  },

  analyzeIsolatedPonents(groups: ArchNgPonentLoadingGroup[]): NgPonentAnalyzeType {
    const result: NgPonentAnalyzeType = {
      modules: new Set<ArchNgPonent>(),
      services: new Set<ArchNgPonent>(),
      components: new Set<ArchNgPonent>()
    };

    groups.forEach(group => {
      group.archNgPonents.forEach(ponent => groupNgPonentByType(result, ponent));
    });

    return result;
  },

  analyzeLoadingGroup(group: ArchNgPonentLoadingGroup): NgPonentAnalyzeType {
    const result: NgPonentAnalyzeType = {
      modules: new Set<ArchNgPonent>(),
      services: new Set<ArchNgPonent>(),
      components: new Set<ArchNgPonent>()
    };

    group.archNgPonents.forEach(ponent => groupNgPonentByType(result, ponent));

    return result;
  }
};

function groupNgPonentByType(result: NgPonentAnalyzeType, ponent: ArchNgPonent) {
  if (moduleTypePonents.includes(ponent.ngPonentType)) {
    result.modules.add(ponent);
  } else if (isArchService(ponent)) {
    result.services.add(ponent);
  } else {
    result.components.add(ponent);
  }
}
