import * as Flatted from 'flatted';

import { instantiate } from '../serialization';
import { NgPonent } from './ngponent';
import { Ponent } from './ngponent-definition';
import { TsPonent } from './tsponent';
import { NgTemplateElement } from './ng-template';

const clazzConfig = {
  NgPonent: NgPonent,
  TsPonent: TsPonent,
  NgTemplateElement: NgTemplateElement
};

export function convertJsonToPonent(response): Ponent[] {
  if (!response) {
    return null;
  }

  const array = Flatted.parse(response);
  instantiate(clazzConfig)(array);

  return array;
}
