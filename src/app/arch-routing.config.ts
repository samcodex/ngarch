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
    loadChildren: () => import('./ng-app-viewer/ng-app-viewer.module').then(m => m.NgAppViewerModule)
  },
  {
    path: NavigationPaths.ArchRouterPath,
    loadChildren: () => import('./router-path-viewer/router-path-viewer.module').then(m => m.RouterPathViewerModule)
  },
  {
    path: NavigationPaths.ArchApisViewer,
    loadChildren: () => import('./arch-apis-viewer/arch-apis-viewer.module').then(m => m.ArchApisViewerModule)
  },
  {
    path: NavigationPaths.LoadingStrategy,
    loadChildren: () => import('./loading-strategy/loading-strategy.module').then(m => m.LoadingStrategyModule)
  },
  {
    path: NavigationPaths.AppSummary,
    loadChildren: () => import('./ponent-summary/ponent-summary.module').then(m => m.PonentSummaryModule)
  },
  {
    path: NavigationPaths.PonentDiagram,
    loadChildren: () => import('./ponent-diagram/ponent-diagram.module').then(m => m.PonentDiagramModule)
  },
  {
    path: NavigationPaths.AnalysisModules,
    loadChildren: () => import('./ponent-mokuai/ponent-mokuai.module').then(m => m.PonentMokuaiModule)
  },
  {
    path: NavigationPaths.FullStructure,
    loadChildren: () => import('./full-structure/full-structure.module').then(m => m.FullStructureModule)
  },
  {
    path: NavigationPaths.ClazzDiagram,
    loadChildren: () => import('./clazz-diagram/clazz-diagram.module').then(m => m.ClazzDiagramModule)
  },
  {
    path: NavigationPaths.ServiceList,
    loadChildren: () => import('./service-dependency/service-dependency.module').then(m => m.ServiceDependencyModule)
  },
  {
    path: NavigationPaths.RouteList,
    loadChildren: () => import('./routing-structure/routing-structure.module').then(m => m.RoutingStructureModule)
  },
  {
    path: NavigationPaths.FileExplorer,
    loadChildren: () => import('./file-explorer/file-explorer.module').then(m => m.FileExplorerModule)
  },
  {
    path: NavigationPaths.ArchCli,
    loadChildren: () => import('./arch-cli/arch-cli.module').then(m => m.ArchCliModule)
  },
  {
    path: '**',
    redirectTo: NavigationPaths.AppSummary
  }
];
