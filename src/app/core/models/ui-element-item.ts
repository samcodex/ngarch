import { cloneDeep } from 'lodash-es';

import { AnalysisElementType } from './analysis-element';
import { util } from '@util/util';
import { MetaInputType } from '@config/meta-config';

export interface UiElementItem<T = {}, S = any, P = any> {
  // properties
  id?: string;
  name: string;
  type: AnalysisElementType | P | null;
  value?: S;
  data?: T;
  icon?: string;
  iconType?: string;        // text(default)/material/font-awesome

  href?: string;
  path?: string;
  tip?: string;
  subtitle?: string;
  description?: string;
  details?: string[];
  order?: number;
  inputType?: MetaInputType;
  filterFn?: (...p) => boolean;

  // status
  isDisabled?: boolean;
  isClickable?: boolean;
  isUsed?: boolean;
  isCheckable?: boolean;

  // action
  isSelected?: boolean;
  isChecked?: boolean;
  isExpanded?: boolean;
  isClicked?: boolean;
}

export function initUiElementItems(items: UiElementItem[], isClone = true): UiElementItem[] {
  const uiItems = isClone ? cloneDeep(items) : items;
  const defValues = {
    isUsed: true,
    isDisabled: false,
    order: 0
  };

  uiItems.forEach(
    util.assignMultipleDefaultValues(defValues)
  );

  return uiItems;
}
