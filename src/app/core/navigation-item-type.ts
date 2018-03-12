

export enum NavigationFeature {
  VIEW = 'View',
  FEATURE = 'Feature'
}

export interface NavigationItem {
  id: string;
  name: string;
  title: string;
  path?: string;
  feature: NavigationFeature;

  isSelected?: boolean;
}
