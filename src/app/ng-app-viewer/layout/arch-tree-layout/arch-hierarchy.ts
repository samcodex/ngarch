import * as d3 from 'd3';

import { DiagramTreeNode } from '@core/diagram-tree/diagram-tree-node';
import { ArchNgPonentInjectable } from '@core/arch-ngponent';
import { AnalysisElementType } from '@core/models/analysis-element';
import { ArchConfig } from '@core/diagram-impls/element/diagram-element.config';

// type
// export type DiagramNode = d3.HierarchyNode<DiagramTreeNode>;
export type ArchHierarchyPointNode = d3.HierarchyPointNode<DiagramTreeNode>;     // d3.HierarchyPointNode derived from d3.HierarchyNode
export type ArchHierarchyPointLink = d3.HierarchyPointLink<DiagramTreeNode>;
export type HierarchyPointLinkSelection = d3.Selection<d3.BaseType, ArchHierarchyPointLink, d3.BaseType, any>;
export type HierarchyPointNodeSelection = d3.Selection<d3.BaseType, ArchHierarchyPointNode, d3.BaseType, any>;

export namespace ArchHierarchy {
  export const toggleArchHierarchyNode = _toggleArchHierarchyNode;
  export const alignChildrenWithCollapseStatus = _alignChildrenWithCollapseStatus;
  export const getProviderNodes = _getProviderNodes;
}

function _toggleCollapse(node: ArchHierarchyPointNode) {
  node.data.toggleCollapsed();
}

function _isCollapsed(node: ArchHierarchyPointNode) {
  return !!node.data.isCollapsed;
}

function _toggleArchHierarchyNode(node: ArchHierarchyPointNode) {
  _toggleCollapse(node);
  _changeChildrenForCollapse(node);
}

function _alignChildrenWithCollapseStatus(node: ArchHierarchyPointNode) {
  const children = _changeChildrenForCollapse(node);
  if (children) {
    children.forEach(_alignChildrenWithCollapseStatus);
  }
}

function _changeChildrenForCollapse(node: ArchHierarchyPointNode): ArchHierarchyPointNode[] {
  return _isCollapsed(node) ? _hideChildren(node) : _showChildren(node);

  function _hideChildren(pNode: ArchHierarchyPointNode): ArchHierarchyPointNode[] {
    if (!!pNode.children) {
      pNode['_children'] = pNode.children;
      pNode.children = null;
    }

    return pNode['_children'];
  }

  function _showChildren(pNode: ArchHierarchyPointNode): ArchHierarchyPointNode[] {
    if (!pNode.children) {
      pNode.children = pNode['_children'];
      pNode['_children'] = null;
    }

    return pNode.children;
  }
}

function _getProviderNodes(node: ArchHierarchyPointNode): ArchNgPonentInjectable[] {
  const providers: ArchNgPonentInjectable[] = node.data.getRelatedProviderPonents();
  return providers;
}

// -------------- helper functions
function getElementType(pointNode: ArchHierarchyPointNode) {
  const element = pointNode.data;
  return 'getElementType' in element ? element.getElementType() : null;
}

function isSameElementType(pointNode: ArchHierarchyPointNode, checkType: AnalysisElementType) {
  const elementType = getElementType(pointNode);
  return elementType === checkType;
}

function isApplication(pointNode: ArchHierarchyPointNode) {
  return isSameElementType(pointNode, AnalysisElementType.Application);
}

function isModule(pointNode: ArchHierarchyPointNode) {
  return isSameElementType(pointNode, AnalysisElementType.Module);
}

function isComponent(pointNode: ArchHierarchyPointNode) {
  return isSameElementType(pointNode, AnalysisElementType.Component);
}

function isDirective(pointNode: ArchHierarchyPointNode) {
  return isSameElementType(pointNode, AnalysisElementType.Directive);
}

function isService(pointNode: ArchHierarchyPointNode) {
  return isSameElementType(pointNode, AnalysisElementType.Service);
}

function isRoutes(pointNode: ArchHierarchyPointNode) {
  return isSameElementType(pointNode, AnalysisElementType.Routes);
}

function isRoute(pointNode: ArchHierarchyPointNode) {
  return isSameElementType(pointNode, AnalysisElementType.Route);
}

function isCollapse(node: ArchHierarchyPointNode): boolean {
  return node.hasOwnProperty('_children') && !!node['_children'];
}

function getVisibility(node: ArchHierarchyPointNode): string {
  return isCollapse(node) ? 'visible' : 'hidden';
}

const isRoutesOrRouteNode = (d: ArchHierarchyPointNode) => isRoutes(d) || isRoute(d);

const isNotRoutesOrRouteNode = (d: ArchHierarchyPointNode) => !isRoutesOrRouteNode(d);

const defaultColor = '#fff';

function _getNodeColor(useLightColor = true, useLightTheme = false) {
  return (pointNode: ArchHierarchyPointNode) => {
    const elementType = getElementType(pointNode);
    const color = ArchConfig.getElementColor(elementType, useLightColor, useLightTheme);
    return color ? color : defaultColor;
  };
}

function _getNodeColors(pointNode: ArchHierarchyPointNode) {
  const elementType = getElementType(pointNode);
  return ArchConfig.getElementColors(elementType);
}

export const ArchHierarchyHelper = {
  getElementType: getElementType,
  isSameElementType: isSameElementType,
  isApplication: isApplication,
  isModule: isModule,
  isComponent: isComponent,
  isDirective: isDirective,
  isService: isService,
  isRoutes: isRoutes,
  isRoute: isRoute,
  getVisibility: getVisibility,
  isRoutesOrRouteNode: isRoutesOrRouteNode,
  isNotRoutesOrRouteNode: isNotRoutesOrRouteNode,
  getNodeColor: _getNodeColor,
  getNodeColors: _getNodeColors
};
