import { Routes } from '@angular/router';

import { NavigationItem, NavigationFeature } from './core/navigation-item-type';

export enum NavigationPaths {
  PonentSummary = 'ponent-summary',
  MvcPattern = 'MvcPattern',
  PonentDiagram = 'ponent-diagram',
  FullStructure = 'full-structure',
  ServiceDependency = 'service-dependency',
  ClazzDiagram = 'clazz-diagram',
  RoutingStructure = 'routing-structure',
  FileExplorer = 'file-explorer'
}

export const ArchRoutes: Routes = [
  {
    path: '',
    redirectTo: NavigationPaths.PonentSummary,
    pathMatch: 'full'
  },
  {
    path: NavigationPaths.MvcPattern,
    loadChildren: 'app/mvc-pattern/mvc-pattern.module#MvcPatternModule'
  },
  {
    path: NavigationPaths.PonentSummary,
    loadChildren: 'app/ponent-summary/ponent-summary.module#PonentSummaryModule'
  },
  {
    path: NavigationPaths.PonentDiagram,
    loadChildren: 'app/ponent-diagram/ponent-diagram.module#PonentDiagramModule'
  },
  {
    path: NavigationPaths.FullStructure,
    loadChildren: 'app/full-structure/full-structure.module#FullStructureModule'
  },
  {
    path: NavigationPaths.ClazzDiagram,
    loadChildren: 'app/clazz-diagram/clazz-diagram.module#ClazzDiagramModule'
  },
  {
    path: NavigationPaths.ServiceDependency,
    loadChildren: 'app/service-dependency/service-dependency.module#ServiceDependencyModule'
  },
  {
    path: NavigationPaths.RoutingStructure,
    loadChildren: 'app/routing-structure/routing-structure.module#RoutingStructureModule'
  },
  {
    path: NavigationPaths.FileExplorer,
    loadChildren: 'app/file-explorer/file-explorer.module#FileExplorerModule'
  },
  {
    path: '**',
    redirectTo: NavigationPaths.PonentSummary
  }
];

export const ArchNavigationItems: NavigationItem[] = [
  {
    id: 'summary',
    name: 'App Summary',
    title: 'Modules & Components Summary',
    path: NavigationPaths.PonentSummary,
    feature: NavigationFeature.VIEW
  },
  {
    id: 'mvc',
    name: 'MVC Pattern',
    title: 'MVC Pattern',
    path: NavigationPaths.MvcPattern,
    feature: NavigationFeature.VIEW
  },
  {
    id: 'diagram',
    name: 'Module-Component',
    title: 'Modules & Components Diagram',
    path: NavigationPaths.PonentDiagram,
    feature: NavigationFeature.VIEW
  },
  {
    id: 'full_structure',
    name: 'All Modules & Components',
    title: 'All Modules & Components Diagram',
    path: NavigationPaths.FullStructure,
    feature: NavigationFeature.VIEW
  },
  {
    id: 'clazz_diagram',
    name: 'Model Diagram',
    title: 'All Modules & Components Diagram',
    path: NavigationPaths.ClazzDiagram,
    feature: NavigationFeature.VIEW
  },
  {
    id: 'service_dependency',
    name: 'Service Dependency Diagram',
    title: 'Service Dependency Diagram',
    path: NavigationPaths.ServiceDependency,
    feature: NavigationFeature.VIEW
  },
  {
    id: 'routing_structure',
    name: 'Routing Structure',
    title: 'Routing Structure',
    path: NavigationPaths.RoutingStructure,
    feature: NavigationFeature.VIEW
  },
  {
    id: 'file_explorer',
    name: 'File Explorer',
    title: 'File Explorer',
    path: NavigationPaths.FileExplorer,
    feature: NavigationFeature.VIEW
  }
];
