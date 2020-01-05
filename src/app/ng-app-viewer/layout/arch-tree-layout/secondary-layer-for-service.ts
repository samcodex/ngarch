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

// service has injector, dependency
const _setAttrs = d3_util.setAttrs;

// service
const serviceNodeColor = ArchConfig.getElementColors(AnalysisElementType.Service)[1];
const serviceNodeName = (node: ArchHierarchyPointNode) => node.data.name;

// injector
const injectorNodeSize: PairNumber = [120, 22];
const injectorNodeOffset: PairNumber = [ -25, 3 ];
const injectorTexts = { [AnalysisElementType.Module] : 'Module Injector', [AnalysisElementType.Component]: 'Element Injector'};
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
  'font-size': '9px'
};

// dependency
const dependencyNodeSize: PairNumber = [60, 22];
const dependencyNodeOffset: PairNumber = [ 0, -3 ];

const placeNode = (halfOffset: PairNumber, nodeSize: PairNumber, offsetMinusWidth = true) => {
  const [ nodeWidth, nodeHeight ] = nodeSize;
  return function(pointNode: ArchHierarchyPointNode) {
    const host: d3Element = d3.select(this);
    // let { x, y } = pointNode['realPosition'];
    let { x, y } = pointNode;
    x += ((offsetMinusWidth ? -nodeWidth : 0) + halfOffset[0]);
    y += halfOffset[1];

    d3_util.translateTo(host, x, y);
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
    const nodes = this.treeRoot.descendants()
      .filter(node => {
        const injector = node.data.getRelatedInjectorArchNgPonents();
        return injector && Array.isArray(injector) && injector.length;
      });

    const gNode = this.secondaryLayer
      .selectAll('.secondary_injector')
      .data(nodes, function(_datum: DiagramTreeNode) {
        const archNgPonent = _datum.data.getRelatedInjectorArchNgPonents();
        return _datum as any;
      });

    const nodeEnter = gNode
      .enter()
      .append('g')
      .classed('secondary_injector', true)
      .each(placeNode(injectorNodeOffset, this.nodeDrawer.nodeSize));

      d3_svg.svgForeignDivText(nodeEnter, {text: serviceNodeName}, injectorNodeSize, null, injectorTextAttrs);
    // d3_svg.svgRect(nodeEnter, '', [0, 0], injectorNodeSize, injectorRectAttrs);
    // d3_svg.svgText(nodeEnter, serviceNodeName, '', [5, 10], injectorTextAttrs);
    // d3_svg.svgText(nodeEnter, injectorText, '', [5, 19], injectorTextAttrs);
  }

  drawDependency() {
    const nodes = this.treeRoot.descendants()
    .filter(node => {
      const injector = node.data.getRelatedCtorDependencies();
      return injector && Array.isArray(injector) && injector.length;
    });

    const gNode = this.secondaryLayer
      .selectAll('.secondary_dependency')
      .data(nodes, function(_datum: DiagramTreeNode) {
        const archNgPonent = _datum.data.getRelatedInjectorArchNgPonents();
        return _datum as any;
      });

    const nodeEnter = gNode
      .enter()
      .append('g')
      .classed('secondary_dependency', true)
      .each(placeNode(dependencyNodeOffset, this.nodeDrawer.nodeSize, false));

      const rectStyle = {
        'stroke': '#888888',
        'stroke-width': '1px',
        'opacity': '.8',
      };

    // d3_svg.svgRect(nodeEnter, '', [0, 0], dependencyNodeSize, serviceRectAttrs);
    // d3_svg.svgText(nodeEnter, () => 'dependency', '', [5, 14], serviceTextAttrs);
    const [ width, height ] = this.nodeDrawer.nodeSize;
    nodeEnter.call(drawRectangleFn([ width, height - 10 ]));
    nodeEnter.call(drawThreeGearsFn());
    nodeEnter
      .call(d3_util.setStyles, rectStyle)
      .attr('fill', serviceNodeColor);
  }
}
