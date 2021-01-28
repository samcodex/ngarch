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
  selectedItem?: UiElementItem;
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

export function assignCategorySelectedItem(resetSelectedItem = true) {
  return (category: UiElementCategory<any>) => {
    if (resetSelectedItem) {
      category.selectedItem = null;
    }
    category.items.some(item => {
      if (category.selectedItem) {
        return true;
      } else {
        if (item.isChecked) {
          category.selectedItem = item;
          return true;
        }
        return false;
      }
    });
  };
}

export function traverseUiElementData(sections: UiElementData, callbacks: { section?: Function, category?: Function, item?: Function}) {
  const callback = (name: string, param) => callbacks && callbacks.hasOwnProperty(name) ? callbacks[name].call(null, param) : null;

  sections.forEach(section => {
    callback('section', section);
    section.categories.forEach(category => {
      callback('category', category);
      category.items.forEach(item => {
        callback('item', item);
      });
    });
  });
}

export function checkCategoryItemWithValue(category: UiElementCategory<any>, itemValue: any): UiElementItem {
  let found: UiElementItem = null;
  if (category) {
    assignCategorySelectedItem()(category);
    found = itemValue ? category.items.find(item => item.value === itemValue) : null;
    if (found) {
      found.isChecked = true;
    }
    category.items.forEach(item => {
      if (item.isChecked && item !== found) {
        item.isChecked = false;
      }
    });
  }

  category.selectedItem = found;
  return found;
}
