import { Callbacks } from '@core/models/meta-data';

export interface LayoutOptions {
  callbacks?: Callbacks;
  orientation?: Orientation;
  features?: LayoutFeature[];
  infoLevel?: NodeInfoLevel;
}

export enum Orientation {
  TopToBottom = 'topToBottom',
  LeftToRight = 'leftToRight'
}

export enum NodeInfoLevel {
  Basic = 'Basic',
  Detail = 'Detail',
  Complex = 'Complex',
  SuperComplex = 'SuperComplex'
}

export enum LayoutFeature {
  None = 'None',
  CollapseAfterSecondLevel = 'CollapseAfterSecondLevel',
  SecondaryLayerForInjector = 'SecondaryLayerForInjector'
}

export function hasLayoutFeature(options: LayoutOptions, feature: LayoutFeature): boolean {
  return options && options.features && Array.isArray(options.features) && options.features.includes(feature);
}
