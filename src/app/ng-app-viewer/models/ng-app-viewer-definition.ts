import { Type, InjectionToken } from '@angular/core';
import { UiElementCategory } from '@core/models/ui-element-category';

export enum ViewerType {
  AppArchViewer = 'AppArchViewer',      // RouteTree
  ModuleStructureTree = 'ModuleStructureTree',        // use TreeLayout latest version, version 3
  ServiceDependencyTree = 'ServiceDependencyTree'
}

export enum DiagramViewerType {
  ActivityDiagram,
  StructureDiagram,
  ClassVisualizer,
  CodeDiagram,
  PonentCliDiagram
}

const pathToViewerType = {
  'app-arch': ViewerType.AppArchViewer,
  'module-struct': ViewerType.ModuleStructureTree,
  'service-dep': ViewerType.ServiceDependencyTree
};

export type TypeOfViewerComponentMap = { [ key in ViewerType ]: Type<any>};

export function getNgAppViewerTypeByPath(viewerId: string): ViewerType {
  return pathToViewerType[viewerId] || ViewerType.AppArchViewer;
}
