import { NameValue } from '../../core/models/name-value';
import { ArchNgPonent } from '../../core/arch-ngponent';

export class SummarySection {
  category: SummaryCategory;
  name: string;
  title: string;
  description: string;
  order: number;
  isDisable = true;

  details?: NameValue[];

  items: NameValue<SummaryItem[], { title, tooltip? }>[];

  constructor(category: SummaryCategory, name: string, title: string) {
    this.category = category;
    this.name = name;
    this.title = title;
  }
}

export interface SummaryItem {
  name: string;
  description?: string;
  type?: string;
  ref?: ArchNgPonent;
  link?: string;
  url?: string;
}

export enum SummaryCategory {
  AllLoadingGroup = 'allLoadingGroup',
  IsolatedPonent = 'isolatedPonent',
  BootstrapGroup = 'bootstrapGroup',
  LazyLoadingGroup = 'lazyLoadingGroup',
  RouteDefinition = 'routeDefinition'
}

export const SummaryAppCategories: SummaryCategory[] = [
  SummaryCategory.AllLoadingGroup,
  SummaryCategory.IsolatedPonent,
  SummaryCategory.RouteDefinition
];

export const SummaryDetailCategories: SummaryCategory[] = [
  SummaryCategory.BootstrapGroup,
  SummaryCategory.LazyLoadingGroup
];
