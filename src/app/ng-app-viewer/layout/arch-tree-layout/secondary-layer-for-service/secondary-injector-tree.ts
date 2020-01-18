import * as d3 from 'd3';
import { get } from 'lodash-es';
import { cloneDeep } from 'lodash-es';

import { LayoutOptions, DiagramElementFeature } from '@core/diagram';
import { ArchHierarchyPointNode, ArchHierarchyHelper } from '../arch-hierarchy';
import { d3Element } from '@core/svg/d3-def-types';
import { d3_svg } from '@core/svg/d3.svg';
import { d3_util } from '@core/svg/d3.util';
import { AnalysisElementType } from '@core/models/analysis-element';
import { ArchHierarchyNodeDrawer } from '../arch-hierarchy-node-drawer';
import { PairNumber } from '@core/models/arch-data-format';
import { drawThreeGearsFn, drawRectangleFn, drawText } from '../arch-hierarchy-node-shape';
import { ArchConfig } from '@core/diagram-impls/element/diagram-element.config';
import { InjectorTreeNode } from '@core/diagram-tree/injector-tree';
import { getArchPonentActions, PonentActionItem } from '../../../models/viewer-content-types';
import { d3_shape } from '@core/svg/d3.shape';

// service has injector, dependency
const _setAttrs = d3_util.setAttrs;
const _setStyles = d3_util.setStyles;
const injectorTexts = { [AnalysisElementType.Module] : 'ModuleInjector', [AnalysisElementType.Component]: 'ElementInjector'};

// config - styles
const injectorDivAttrs = {
  'font-size': '9px',
  'background-color': '#fb6702',
  'float': 'right',
  'border-radius': '5px',
  'padding': '2px 6px 0px 6px',
  'border': '1px solid #ff9c59',
  'display': 'inline-block',
  'color': '#000000',
  'opacity': '1',
  'font-weight': '500',
  'word-wrap': 'break-word',
  'min-width': '88%'
};

const lineStyle = {
  'stroke': '#1e5799',
  'stroke-width': 1
};
const rectStyle = {
  'stroke': '#ff9c59',
  'stroke-width': '1px',
  'opacity': '1',
  'cursor': 'pointer'
};
const providerColor = ArchConfig.getElementColor(AnalysisElementType._Provider);
const normalTextColor = '#000000';

// config - position
const injectorNodeSize: PairNumber = [120, 32];
const injectorNodeOffset: PairNumber = [ -25, -2 ];

const getInjectorPosition = (point: any) => [get(point, 'positions.injector.x'), get(point, 'positions.injector.y')] as PairNumber;

const calcNodePositionFn = (halfOffset: PairNumber, nodeSize: PairNumber) => {
  const [ nodeWidth, nodeHeight ] = nodeSize;
  return function(pointNode: ArchHierarchyPointNode) {
    let { x, y } = pointNode;
    x += -nodeWidth / 2 + halfOffset[0];
    y += halfOffset[1];

    return {x, y};
  };
};

function calcCircleX(r: number, y: number) {
  return Math.sqrt(Math.pow(r, 2 ) - Math.pow(y, 2));
}
const radius = 200;
const totalVertical = 6;
const intervalVertical = radius * 2 / totalVertical;
const xRanges = [-1, 1 ];
const yRanges = [1, -1];
const circlePoints = [];
const noise = 14;
xRanges.forEach((xRange, index) => {
  const yRange = yRanges[index];
  for (let i = 0; i < totalVertical; i++) {
    const y = yRange * (radius - i * intervalVertical  - noise);
    const x = xRange * calcCircleX(radius, y);
    circlePoints.push([x, y]);
  }
});

// service
const serviceNodeName = (node: ArchHierarchyPointNode) => {
  const data = node.data as any;
  return (data.host ? data.host.name + ' ' : '') + data.category;
};
const drawInjectorRect = d3_svg.svgForeignExtendableDiv({text: serviceNodeName}, injectorNodeSize, null, injectorDivAttrs);
const isInjectorNode = (node: d3.HierarchyCircularNode<any>): boolean => node.data instanceof InjectorTreeNode && node.data.isInjectorNode;
const isProviderNode = (node: d3.HierarchyCircularNode<any>): boolean => node.data instanceof InjectorTreeNode && node.data.isProviderNode;

// provider actions
const ponentActions = getArchPonentActions();
const mapNodeToActions = () => cloneDeep(ponentActions[AnalysisElementType.Service]);
const barColorFn = ArchHierarchyHelper.getNodeColor(false);
const actionColorFn = ArchHierarchyHelper.getNodeColor();
const actionY = 35;

// node single-click and double-click event handler
const nodeDoubleClickFn = (diagramNode: ArchHierarchyPointNode) => {
  const element = diagramNode.data;
  if (element && 'getFeatureCallback' in element) {
    const callback = element.getFeatureCallback(DiagramElementFeature.DblClick);
    if (callback) {
      callback.call(null, element);
    }
  }
};
const nodeClickFn = (diagramNode: ArchHierarchyPointNode) => {
  const element = diagramNode.data;
  if (element && 'getFeatureCallback' in element) {
    const callback = element.getFeatureCallback(DiagramElementFeature.Click);
    if (callback) {
      callback.call(null, element);
    }
  }
};

export class SecondaryInjectorTree {
  private injectorHierarchy: d3.HierarchyNode<InjectorTreeNode>;

  constructor(
    private secondaryLayer: d3Element,
    private rootGroup: d3Element,
    private treeRoot: ArchHierarchyPointNode,
    private layoutOptions: LayoutOptions,
    private nodeDrawer: ArchHierarchyNodeDrawer,
    private mainLayerCallbacks: { onClickAction: any, zoomFactorFn: any }
  ) {
  }

  drawInjector() {
    const root = this.treeRoot.data;
    const injectorTree = root.injectorSubTree;
    const injectorRoot = injectorTree.root;
    this.injectorHierarchy = d3.hierarchy(injectorRoot, (injectorNode) => !injectorNode.isCollapsed ? injectorNode.children : null);

    // calculate Injector nodes' position
    const calcPosition = calcNodePositionFn(injectorNodeOffset, this.nodeDrawer.nodeSize);

    const nodes = this.injectorHierarchy.descendants();
    const rootModuleNode = nodes.find(node => node.data.rootModule);
    nodes.forEach(function (pointNode: d3.HierarchyNode<InjectorTreeNode>, index) {
      let hostPoint = null;
      if (index <= 1) {
        // two PlatformInjector, NullInjector & PlatformModuleInjector
        hostPoint = rootModuleNode.data.host._hierarchyNode;
      } else if (pointNode.data.host) {
        hostPoint = pointNode.data.host._hierarchyNode;
      }

      if (hostPoint) {
        const injectorPosition = calcPosition(hostPoint);
        const offsetY = index <= 1 ? (2 - index) * -80 : 0;
        injectorPosition.y += offsetY;

        if (!pointNode.hasOwnProperty('positions')) {
          pointNode['positions'] = {};
        }
        pointNode['positions']['injector'] = injectorPosition;

        if (pointNode.children) {
          const providerNodes = pointNode.children.filter(isProviderNode);
          if (providerNodes && providerNodes.length) {
            providerNodes.forEach((node, idx) => {
              if (idx < circlePoints.length ) {
                let [x, y] = circlePoints[idx];
                x += injectorPosition.x;
                y += injectorPosition.y;
                // center
                node['positions'] = { 'injector': {x, y} };
              } else {
                console.error('[TODO] - Need to display more providers');
              }
            });
          }
        }
      }
    });

    this.drawInjectorLinks();

    this.drawInjectorNodes();
  }

  private drawInjectorNodes() {
    const nodes = this.injectorHierarchy.descendants();
    const nodeSize = this.nodeDrawer.nodeSize;
    const [ nodeWidth, nodeHeight ] = nodeSize;

    const nodeEnter = this.secondaryLayer
      .selectAll('.secondary_injector')
      .data(nodes)
      .enter()
      .append('g')
      .classed('secondary_injector', true)
      .each(function (pointNode: d3.HierarchyNode<InjectorTreeNode>) {
        if (pointNode['positions']) {
          const host: d3Element = d3.select(this);
          const [x, y] = getInjectorPosition(pointNode);
          d3_util.translateTo(host, x - injectorNodeSize[0] / 2, y - injectorNodeSize[1] / 2);
        }
      });

    const injectorNode = nodeEnter
      .filter(isInjectorNode)
      .call(drawInjectorRect);

    const providerNode = nodeEnter
      .filter(isProviderNode)
      .call((self) => {
        drawRectangleFn(nodeSize, rectStyle, false)(self as any);
        drawThreeGearsFn()(self as any);
        drawText(nodeSize, self as any, {color: normalTextColor});
      })
      .call(_setStyles, rectStyle)
      .attr('fill', providerColor);

    this.nodeDrawer.drawNodeExpandButtonFn(false)(providerNode as any);

    d3_shape.drawActionBar(this.secondaryLayer, nodeWidth + 20, actionY)(providerNode, mapNodeToActions,
      this.onClickActionItem.bind(this), this.getZoomFactorFn(), barColorFn, actionColorFn);

    d3_shape.createNodeEvent<ArchHierarchyPointNode>(providerNode, nodeDoubleClickFn, nodeClickFn);

    d3_shape.drawNodeTip()(injectorNode);
  }

  private drawInjectorLinks() {
    const links = this.injectorHierarchy.links();
    const injectorLinksGroup = this.secondaryLayer.append('g').classed('injector_links', true);

    injectorLinksGroup
      .selectAll('.injector_link')
      .data(links)
      .enter()
      .each(function(link) {
        const host: d3Element = d3.select(this);
        const { source, target } = link;
        const startPoint = getInjectorPosition(source);
        const endPoint = getInjectorPosition(target);

        if (startPoint && endPoint) {
          d3_svg.svgLine(host, 'injector_link', startPoint, endPoint, null, lineStyle);
        }
      });

    return injectorLinksGroup;
  }

  private onClickActionItem(action: PonentActionItem) {
    this.mainLayerCallbacks.onClickAction(action);
  }

  private getZoomFactorFn() {
    return this.mainLayerCallbacks.zoomFactorFn();
  }
}
