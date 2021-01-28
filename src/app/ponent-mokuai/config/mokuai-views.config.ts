import { UiElementItem } from '@core/models/ui-element-item';
import { MetaValue } from '@core/models/meta-data';

export enum MokuaiViewPaths {
  Details = 'details',
  Routes = 'routes',
  Config = 'config'
}

export const MOKUAI_VIEWS: UiElementItem[] = [
  {
    name: 'Module/Composition',
    value: MetaValue.Composition,
    type: null,
    tip: '',
    path: MokuaiViewPaths.Details,
    isSelected: true,
    isCheckable: true
  },
  {
    name: 'Module/Dependency',
    value: MetaValue.Dependency,
    type: null,
    tip: '',
    path: MokuaiViewPaths.Details,
    isCheckable: true
  },
  {
    name: 'Details',
    type: null,
    tip: '',
    path: MokuaiViewPaths.Details,
    isCheckable: true
  },
  {
    name: 'Routes',
    path: MokuaiViewPaths.Routes,
    type: null
  },
  {
    name: 'Config',
    type: null,
    tip: '',
    path: MokuaiViewPaths.Config,
    isUsed: false
  }
];
