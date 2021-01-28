import { findKey, first } from 'lodash-es';

import { AnalysisElementType } from '../models/analysis-element';
import { NgPonentType } from '../ngponent-tsponent';
import { RectangleSize } from '@core/models/arch-data-format';
import { d3Element } from '@core/svg/d3-def-types';
import { BoardOptions } from './../diagram/board.config';

export enum DiagramElementType {
  Diagram = 'Diagram',
  Element = 'Element',
  Item = 'Item',
  Line = 'Line',
  Tip = 'Tip'
}

export const MappingOfNgTypes_Element: {[ key in AnalysisElementType]?: NgPonentType[]} = {
  [AnalysisElementType.Module]: [NgPonentType.NgModule],
  [AnalysisElementType.Component]: [NgPonentType.Component],
  [AnalysisElementType.Directive]: [NgPonentType.Directive],
  [AnalysisElementType.Pipe]: [NgPonentType.Pipe],
  [AnalysisElementType.Service]: [NgPonentType.Injectable],
  [AnalysisElementType.Model]: [NgPonentType.Model],
  [AnalysisElementType.Other]: [],
  [AnalysisElementType.Routes]: [NgPonentType.Routes],
  [AnalysisElementType.Route]: [NgPonentType.Route]
};

export const mapNgPonentTypeToElementType = (ngPonentType: NgPonentType): AnalysisElementType => {
  const elementValue: string = findKey(MappingOfNgTypes_Element, (value) => value.indexOf(ngPonentType) > -1);
  const elementType: AnalysisElementType = elementValue && elementValue.length > 0
    ? AnalysisElementType[elementValue]
    : AnalysisElementType.Other;

  return elementType;
};

export const mapElementTypeToNgPonentType = (elementType: AnalysisElementType): NgPonentType => {
  return first(MappingOfNgTypes_Element[elementType]);
};

export const ModuleStyleList: AnalysisElementType[] = [
  AnalysisElementType.Module,
  AnalysisElementType.Component,
  AnalysisElementType.Directive
];

export const Padding: RectangleSize = { top: 20, left: 10, right: 10, bottom: 12};

export interface ElementDrawable {
  clear(): void;
  drawTo?<T>(root: d3Element, host: d3Element, options?: BoardOptions, elementOptions?: T): d3Element;
  draw?(hostGroup: d3Element): void;
  moveTo?(x: number, y: number): void;
  move?(): void;
}
