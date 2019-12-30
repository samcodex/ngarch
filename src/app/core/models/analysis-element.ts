import { upperFirst } from 'lodash-es';

export enum AnalysisElementType {
  Application = 'Application',
  Module = 'Module',
  Component = 'Component',
  Directive = 'Directive',
  Service = 'Service',
  Model = 'Model',
  Pipe = 'Pipe',
  Other = 'Other',
  Routes = 'Routes',
  Route = 'Route',

  _Provider = '_Provider',      // NgModule's provider & Component's provider
  _From = '_From',
  _Injector = '_Injector',      // ModuleInjector & ElementInjector
  _Dependency = '_Dependency'
}

export const ElementTypeHelper = {
  getElementType: (type): AnalysisElementType => {
    const tmpType = upperFirst(type);
    const keys = Object.values(AnalysisElementType);
    const index = keys.indexOf(tmpType);
    return index >= 0 ? AnalysisElementType[tmpType] as AnalysisElementType : null;
  }
};
