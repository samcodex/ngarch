import { UiElementItem } from './ui-element-item';
import { MetaInputType } from '@config/meta-config';

export interface UiElementCategory<T = null> {
  id: string;
  name: string;
  type: string | T;
  description?: string;
  isDisabled?: boolean;
  inputType?: MetaInputType;

  items?: UiElementItem[];
}

export interface UiElementSection<S = null, T = null> {
  id: string;
  name: string;
  type: string | S;
  description?: string;
  isDisabled?: boolean;
  inputType?: MetaInputType;

  categories: UiElementCategory<T>[];
}

export type UiElementData = UiElementSection[];

export function findCategoryFromSection<T>(sections: UiElementSection<any, T>[], categoryType: T): UiElementCategory<T> {
  let category: UiElementCategory<T> = null;
  sections.some(section => {
    category = section.categories.find(cat => cat.type === categoryType);
    return !!category;
  });

  return category;
}

export function findItemByValueFromSection<T>(sections: UiElementSection<any, T>[], categoryType: T, itemValue: any): UiElementItem {
  const category = findCategoryFromSection(sections, categoryType);
  return category ? category.items.find(item => item.value === itemValue) : null;
}

export function findItemByTypeFromSection<T>(sections: UiElementSection<any, T>[], categoryType: T, itemType: any): UiElementItem {
  const category = findCategoryFromSection(sections, categoryType);
  return category ? category.items.find(item => item.type === itemType) : null;
}
