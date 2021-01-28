import * as d3 from 'd3';
import { DiagramLinkableElement } from '@core/diagram-element-linkable';
import { RectangleSize } from '@core/models/arch-data-format';

export interface DiagramHierarchyNode extends d3.HierarchyNode<DiagramLinkableElement> {
  dx?: number;
  dy?: number;
}

export interface DiagramHierarchyPointNode extends d3.HierarchyPointNode<DiagramLinkableElement> {
  textWidth?: number;
}
