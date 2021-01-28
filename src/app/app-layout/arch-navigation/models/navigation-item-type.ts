
export enum NavigationCategory {
  ARCHITECTURE_VIEWER = 'ArchitectureViewer',
  APP_INFO = 'AppInfo',
  NAVIGATION_MODULES = 'NavigationModules',
  Arch_CLI = 'ArchCli'
}

export enum NavigationFeature {
  OVERVIEW = 'Overview'
}

export interface NavigationItem {
  id: string;
  name: string;
  title: string;
  path?: string | string[];
  category: NavigationCategory;
  order?: number;

  isDisabled?: boolean;
  isSelected?: boolean;
  isPlaceHolder?: boolean;

  dataKey?: string;
  dataId?: string | NavigationFeature;
  data?: any;
  queryParams?: object;
}

export interface NavigationSection {
  title: string;
  category?: NavigationCategory;
  children?: NavigationItem[];
  isDisabled?: boolean;
  isExpanded?: boolean;
}
