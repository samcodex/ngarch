import * as d3 from 'd3';

import { LayoutOptions } from '@core/diagram/layout-options';
import { ArchHierarchyPointNode, ArchHierarchyHelper } from './arch-hierarchy';
import { d3Element } from '@core/svg/d3-def-types';
import { d3_svg } from '@core/svg/d3.svg';
import { d3_util } from '@core/svg/d3.util';
import { DiagramTreeNode } from '@core/diagram-tree/diagram-tree-node';
import { AnalysisElementType } from '@core/models/analysis-element';
import { ArchHierarchyNodeDrawer } from './arch-hierarchy-node-drawer';
import { PairNumber } from '@core/models/arch-data-format';
import { drawThreeGearsFn, drawRectangleFn } from './arch-hierarchy-node-shape';
import { ArchConfig } from '@core/diagram-impls/element/diagram-element.config';
import { InjectorTreeNode } from '@core/diagram-tree/injector-tree';
import { HierarchyNode } from 'd3';

// service has injector, dependency
const _setAttrs = d3_util.setAttrs;
const injectorTexts = { [AnalysisElementType.Module] : 'ModuleInjector', [AnalysisElementType.Component]: 'ElementInjector'};

// service
const serviceNodeColor = ArchConfig.getElementColors(AnalysisElementType.Service)[1];
const serviceNodeName = (node: ArchHierarchyPointNode) => {
  const category = injectorTexts[node.data.elementType];
  return node.data.name + ' ' + (category ? category : 'PlatformInjector');
}

// injector
const injectorNodeSize: PairNumber = [120, 32];
const injectorNodeOffset: PairNumber = [ -25, -5 ];
const injectorText = (node: ArchHierarchyPointNode) => injectorTexts[node.data.elementType];
const injectorRectAttrs = {
  'fill': '#ff7e26',
  'stroke': '#ff9c59',
  'stroke-width': '1px',
  'opacity': '.8',
  'rx': '5',
  'ry': '5'
};
const injectorTextAttrs = {
  'fill': 'white',
  'font-size': '9px',
};
const injectorDivAttrs = {
  'font-size': '9px',
  'background-color': '#fb6702',
  'float': 'right',
  'border-radius': '5px',
  'padding': '2px 6px 0px 6px',
  'border': '1px solid #ff9c59',
  'display': 'inline-block',
  'color': '#000000',
  'opacity': '0.8',
  'font-weight': '500',
  'word-wrap': 'break-word'
};

// dependency
const dependencyNodeSize: PairNumber = [120, 22];
const dependencyNodeOffset: PairNumber = [ 25, -8 ];
const dependenciesDivAttrs = {
  'font-size': '9px',
  'background-color': '#e0a000',
  'border-radius': '5px',
  'padding': '2px 6px 0px 6px',
  'border': '1px solid #ff9c59',
  'display': 'inline-block',
  'color': '#000000',
  'opacity': '1',
  'font-weight': '500'
};

const placeNode = (halfOffset: PairNumber, nodeSize: PairNumber, offsetMinusWidth = true) => {
  const [ nodeWidth, nodeHeight ] = nodeSize;
  return function(pointNode: ArchHierarchyPointNode, offset: PairNumber = [0, 0]) {
    const host: d3Element = d3.select(this);
    let { x, y } = pointNode;
    const [ offsetX, offsetY ] = offset;
    x += ((offsetMinusWidth ? -nodeWidth : 0) + halfOffset[0]) + offsetX;
    y += halfOffset[1] + offsetY;

    d3_util.translateTo(host, x, y);
    return {x, y};
  };
};

export class SecondaryLayerForService {
  private rootGroup: d3Element;
  private treeRoot: ArchHierarchyPointNode;
  private layoutOptions: LayoutOptions;
  private secondaryLayer: d3Element;
  private nodeDrawer: ArchHierarchyNodeDrawer;

  constructor(rootGroup: d3Element, treeRoot: ArchHierarchyPointNode,
      layoutOptions: LayoutOptions, nodeDrawer: ArchHierarchyNodeDrawer) {
    this.rootGroup = rootGroup;
    this.treeRoot = treeRoot;
    this.layoutOptions = layoutOptions;
    this.nodeDrawer = nodeDrawer;
  }

  clear() {
    this.secondaryLayer.selectAll('*').remove();
  }

  draw() {
    if (!this.secondaryLayer) {
      this.secondaryLayer = this.rootGroup.append('g').classed('secondary_layer_service', true);
    }

    this.drawInjector();

    this.drawDependency();
  }

  drawInjector() {
    const root = this.treeRoot.data;
    const injectorTree = root.injectorSubTree;
    const injectorRoot = injectorTree.root;
    const injectorHierarchy = d3.hierarchy(injectorRoot);

    const drawInjectorNodes = () => {
      const nodes = injectorHierarchy.descendants();
      const rootModuleNode = nodes.find(node => node.data.rootModule);

      let count = 2;
      const placeNodeFn = placeNode(injectorNodeOffset, this.nodeDrawer.nodeSize);
      const nodeEnter = this.secondaryLayer
        .selectAll('.secondary_injector')
        .data(nodes)
        .enter()
        .append('g')
        .classed('secondary_injector', true)
        .each(function (pointNode: HierarchyNode<InjectorTreeNode>) {
          let hostPoint;
          const offset = [0, 0];
          if (pointNode.data.host) {
            hostPoint = pointNode.data.host._hierarchyNode;
          } else if (count > 0) {
            hostPoint = rootModuleNode.data.host._hierarchyNode;
            offset[1] = count * -80;

            --count;
          }

          if (hostPoint) {
            const injectorPosition = placeNodeFn.bind(this)(hostPoint, offset);
            if (!pointNode.hasOwnProperty('positions')) {
              pointNode['positions'] = {};
            }
            pointNode['positions']['injector'] = injectorPosition;
          }
        });

      d3_svg.svgForeignExtendableDiv(nodeEnter, {text: serviceNodeName}, injectorNodeSize, null, injectorDivAttrs);
    };

    const drawInjectorLinks = () => {
      const links = injectorHierarchy.links();
      const injectorLinksGroup = this.secondaryLayer.append('g').classed('injector_links', true);
      const linkEnter = injectorLinksGroup.selectAll('link').data(links).enter();

      const lineStyle = {
        'stroke': '#1e5799',
        'stroke-width': 1
      };
      const getPosition = (point: any) => [point.positions.injector.x, point.positions.injector.y] as PairNumber;
      linkEnter.each(function(link) {
        const host: d3Element = d3.select(this);
        const { source, target } = link;
        const startPoint: PairNumber = getPosition(source);
        const endPoint: PairNumber = getPosition(target);
        startPoint[0] += injectorNodeSize[0] / 2;
        startPoint[1] += injectorNodeSize[1] - 4;
        endPoint[0] += injectorNodeSize[0] / 2;
        endPoint[1] += 1;

        d3_svg.svgLine(host, null, startPoint, endPoint, null, lineStyle);
      });

      return injectorLinksGroup;
    };

    drawInjectorNodes();

    const linksGroup = drawInjectorLinks();
    linksGroup.lower();
  }

  drawDependency() {
    const nodes = this.treeRoot.descendants()
      .filter(node => {
        const injector = node.data.getRelatedCtorDependencies();
        return injector && Array.isArray(injector) && injector.length;
      });

    const placeNodeFn = placeNode(dependencyNodeOffset, this.nodeDrawer.nodeSize, false);
    const nodeEnter = this.secondaryLayer
      .selectAll('.secondary_dependency')
      .data(nodes)
      .enter()
      .append('g')
      .classed('secondary_dependency', true)
      .each(function(pointNode: ArchHierarchyPointNode) {
        placeNodeFn.bind(this)(pointNode);
      });

    // const rectStyle = {
    //   'stroke': '#888888',
    //   'stroke-width': '1px',
    //   'opacity': '0.8',
    // };

    d3_svg.svgForeignExtendableDiv(nodeEnter, {text: () => 'Dependencies'}, dependencyNodeSize, null, dependenciesDivAttrs);

    // d3_svg.svgRect(nodeEnter, '', [0, 0], dependencyNodeSize, serviceRectAttrs);
    // d3_svg.svgText(nodeEnter, () => 'dependency', '', [5, 14], serviceTextAttrs);
    // const [ width, height ] = this.nodeDrawer.nodeSize;
    // nodeEnter.call(drawRectangleFn([ width, height - 10 ]));
    // nodeEnter.call(drawThreeGearsFn());
    // nodeEnter
    //   .call(d3_util.setStyles, rectStyle)
    //   .attr('fill', serviceNodeColor);
  }
}
