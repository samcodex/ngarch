
export enum DiagramItemType {
  // ElementName = 'ElementName',
  SectionName = 'SectionName',
  ElementItem = 'ElementItem',
  SectionFlagLess = 'SectionFlagLess'
}

export class DiagramItem {
  itemType: DiagramItemType;
  value: any;
  link?: any;
  tip?: string;
  disabled?: boolean;

  constructor() {

  }

}

export const DiagramItemClasses: {[key in DiagramItemType]: string} = {
  [ DiagramItemType.SectionName ] : 'section-name',
  [ DiagramItemType.ElementItem ]: 'item-name',
  [ DiagramItemType.SectionFlagLess ]: 'section-flag-less'
};
