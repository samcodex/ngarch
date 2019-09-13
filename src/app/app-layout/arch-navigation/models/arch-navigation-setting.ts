
import { NavigationItem, NavigationCategory, NavigationSection, NavigationFeature } from './navigation-item-type';
import { NavigationPaths } from '../../../arch-routing.config';

const sortFn = (item1: NavigationItem, item2: NavigationItem) => {
  const order1 = 'order' in item1 ? item1.order : 9999;
  const order2 = 'order' in item1 ? item2.order : 9999;

  return order1 - order2;
};

const appDiagram: NavigationItem[] = [
  {
    id: 'application_architecture',
    name: 'Runtime Structure',
    title: 'Runtime Structure',
    path: NavigationPaths.NgAppViewer,
    dataKey: 'viewer',
    dataId: 'app-arch',
    category: NavigationCategory.ARCHITECTURE_VIEWER,
    order: 2
  },
  {
    id: 'angular_ponent_structure',
    name: 'Module Structure',
    title: 'Module Structure',
    path: NavigationPaths.NgAppViewer,
    dataKey: 'viewer',
    dataId: 'module-struct',
    category: NavigationCategory.ARCHITECTURE_VIEWER,
    order: 1
  },
  {
    id: 'service_dependency_tree',
    name: 'Service Dependency Tree',
    title: 'Service Dependency Tree',
    path: NavigationPaths.NgAppViewer,
    dataKey: 'viewer',
    dataId: 'service-dep',
    category: NavigationCategory.ARCHITECTURE_VIEWER,
    isDisabled: true
  },
  {
    id: 'router_path',
    name: 'Router Path View',
    title: 'Router Path View',
    path: NavigationPaths.ArchRouterPath,
    category: NavigationCategory.ARCHITECTURE_VIEWER,
    isDisabled: true
  },
  {
    id: 'apis_viewer',
    name: 'Apis View',
    title: 'Apis View',
    path: NavigationPaths.ArchApisViewer,
    category: NavigationCategory.ARCHITECTURE_VIEWER,
    isDisabled: true
  }
];

const navBasic: NavigationItem[] = [
  {
    id: 'summary',
    name: 'Summary',
    title: 'Application Summary',
    path: NavigationPaths.AppSummary,
    category: NavigationCategory.APP_INFO
  },
  {
    id: 'loading',
    name: 'Loading Strategy',
    title: 'Loading Strategy',
    path: NavigationPaths.LoadingStrategy,
    category: NavigationCategory.APP_INFO
  },
  {
    id: 'full_structure',
    name: 'All Modules & Components',
    title: 'All Modules & Components Diagram',
    path: NavigationPaths.FullStructure,
    category: NavigationCategory.APP_INFO
  },
  {
    id: 'ponent_diagram',
    name: 'Modules Diagram',
    title: 'Modules Diagram',
    path: NavigationPaths.PonentDiagram,
    category: NavigationCategory.APP_INFO
  },
  {
    id: 'file_explorer',
    name: 'File Explorer',
    title: 'File Explorer',
    path: NavigationPaths.FileExplorer,
    category: NavigationCategory.APP_INFO
  }
];

const navModules: NavigationItem[] = [
  {
    id: 'module_diagram',
    name: 'Modules Overview',
    title: 'Modules Overview',
    path: NavigationPaths.AnalysisModules,
    category: NavigationCategory.NAVIGATION_MODULES,
    dataKey: 'module',
    dataId: NavigationFeature.OVERVIEW,
    queryParams: { board: 'SvgBoard'}
  },
  {
    id: 'module_diagram',
    name: 'Modules(Placeholder)',
    title: 'Modules(Placeholder)',
    path: NavigationPaths.AnalysisModules,
    category: NavigationCategory.NAVIGATION_MODULES,
    isPlaceHolder: true,
    dataKey: 'module',
    dataId: null,
    queryParams: { board: 'SvgBoard'}
  }
];

const NavServices: NavigationItem[] = [
  {
    id: 'service_list',
    name: 'Service List',
    title: 'Service List',
    path: NavigationPaths.ServiceList,
    category: NavigationCategory.APP_INFO
  }
];

const navModels: NavigationItem[] = [
  {
    id: 'clazz_diagram',
    name: 'Model List',
    title: 'All Modules & Components Diagram',
    path: NavigationPaths.ClazzDiagram,
    category: NavigationCategory.APP_INFO
  }
];

const navRoutes: NavigationItem[] = [
  {
    id: 'route_list',
    name: 'Route List',
    title: 'Route List',
    path: NavigationPaths.RouteList,
    category: NavigationCategory.APP_INFO
  }
];

const navCli: NavigationItem[] = [
  {
    id: 'ng_cli_exec',
    name: 'Angular Cli Execution',
    title: 'Angular Cli Execution',
    path: [ NavigationPaths.ArchCli, NavigationPaths.NgCliExec ],
    category: NavigationCategory.Arch_CLI,
    isDisabled: false
  },
  {
    id: 'angular_cli_usage',
    name: 'Angular Cli Usage',
    title: 'Angular Cli Usage',
    path: [ NavigationPaths.ArchCli, NavigationPaths.AngularCliUsage ],
    category: NavigationCategory.Arch_CLI
  },
  {
    id: 'generic_cli_exec',
    name: 'Generic Cli Execution',
    title: 'Generic Cli Execution',
    path: [ NavigationPaths.ArchCli, NavigationPaths.GenericCliExec ],
    category: NavigationCategory.Arch_CLI,
    isDisabled: false
  }
];

export const appNavigationItems: NavigationItem[] = [
  ...appDiagram.sort(sortFn),
  ...navBasic.sort(sortFn),
  ...navModules.sort(sortFn),
  ...NavServices.sort(sortFn),
  ...navModels.sort(sortFn),
  ...navRoutes.sort(sortFn),
  ...navCli.sort(sortFn)
];

export const navigationSections: NavigationSection[] = [
  {
    title: 'Architecture',
    category: NavigationCategory.ARCHITECTURE_VIEWER
  },
  {
    title: 'Application Info',
    category: NavigationCategory.APP_INFO
  },
  {
    title: 'Module Diagram',
    category: NavigationCategory.NAVIGATION_MODULES,
  },
  {
    title: 'Cli',
    category: NavigationCategory.Arch_CLI,
    isDisabled: false
  },
];
