import { Routes } from '@angular/router';

export enum NavigationPaths {
  NgAppViewer = 'ng-app-viewer',
  ArchRouterPath = 'arch-router-path',
  ArchApisViewer = 'arch-apis-viewer',

  AppSummary = 'app-summary',
  LoadingStrategy = 'loading-strategy',
  AnalysisModules = 'analysis-modules',
  PonentDiagram = 'ponent-diagram',
  FullStructure = 'full-structure',
  ServiceList = 'service-list',
  ClazzDiagram = 'clazz-diagram',
  RouteList = 'route-list',
  FileExplorer = 'file-explorer',

  ArchCli = 'arch-cli',
  NgCliExec = 'ng-cli-exec',
  AngularCliUsage = 'angular-cli-usage',
  GenericCliExec = 'generic-cli-exec'
}

export const ArchRoutes: Routes = [
  {
    path: '',
    redirectTo: NavigationPaths.NgAppViewer,
    pathMatch: 'full'
  },
  {
    path: NavigationPaths.NgAppViewer,
    loadChildren: './ng-app-viewer/ng-app-viewer.module#NgAppViewerModule'
  },
  {
    path: NavigationPaths.ArchRouterPath,
    loadChildren: './router-path-viewer/router-path-viewer.module#RouterPathViewerModule'
  },
  {
    path: NavigationPaths.ArchApisViewer,
    loadChildren: './arch-apis-viewer/arch-apis-viewer.module#ArchApisViewerModule'
  },
  {
    path: NavigationPaths.LoadingStrategy,
    loadChildren: './loading-strategy/loading-strategy.module#LoadingStrategyModule'
  },
  {
    path: NavigationPaths.AppSummary,
    loadChildren: './ponent-summary/ponent-summary.module#PonentSummaryModule'
  },
  {
    path: NavigationPaths.PonentDiagram,
    loadChildren: './ponent-diagram/ponent-diagram.module#PonentDiagramModule'
  },
  {
    path: NavigationPaths.AnalysisModules,
    loadChildren: './ponent-mokuai/ponent-mokuai.module#PonentMokuaiModule'
  },
  {
    path: NavigationPaths.FullStructure,
    loadChildren: './full-structure/full-structure.module#FullStructureModule'
  },
  {
    path: NavigationPaths.ClazzDiagram,
    loadChildren: './clazz-diagram/clazz-diagram.module#ClazzDiagramModule'
  },
  {
    path: NavigationPaths.ServiceList,
    loadChildren: './service-dependency/service-dependency.module#ServiceDependencyModule'
  },
  {
    path: NavigationPaths.RouteList,
    loadChildren: './routing-structure/routing-structure.module#RoutingStructureModule'
  },
  {
    path: NavigationPaths.FileExplorer,
    loadChildren: './file-explorer/file-explorer.module#FileExplorerModule'
  },
  {
    path: NavigationPaths.ArchCli,
    loadChildren: './arch-cli/arch-cli.module#ArchCliModule'
  },
  {
    path: '**',
    redirectTo: NavigationPaths.AppSummary
  }
];
