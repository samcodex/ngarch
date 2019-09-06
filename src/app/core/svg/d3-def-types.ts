import { PairNumber } from '@core/models/arch-data-format';

export type d3Element<T = any, P = any> = d3.Selection<d3.BaseType, T, d3.BaseType, P>;

export interface D3Transform {
  translate?: PairNumber;
  scale?: number;
}

export interface D3FullAttributes {
  attributes?: object;
  transform?: D3Transform;
}

export interface D3PathAttr {
  path: string;
  name?: string;
  attrs?: object;
  transform?: D3Transform;
}

export interface D3GroupFullAttributes {
  groupFullAttrs?: D3FullAttributes;
  contentFullAttrs?: D3FullAttributes;
}

export interface SvgElementOptions {
  position?: { x?: number, y?: number };
  size?: { width?: number, height?: number };
  margin?: { horizontal?: number, vertical?: number };
  outStyles?: any;
  overStyles?: any;
  attributes?: any;
}

export interface SimpleMargin {
  horizontal?: number;
  vertical?: number;
}
