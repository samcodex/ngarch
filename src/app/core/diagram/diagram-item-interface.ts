import { DiagramItemType } from './diagram-item-type';

export interface IDiagramItem {
  itemType: DiagramItemType;
  value: string;
  link?: any;
  tip?: string;
}
