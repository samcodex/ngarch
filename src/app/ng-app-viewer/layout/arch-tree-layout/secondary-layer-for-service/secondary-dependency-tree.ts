import * as d3 from 'd3';

import { LayoutOptions } from '@core/diagram/layout-options';
import { ArchHierarchyPointNode, ArchHierarchyHelper } from '../arch-hierarchy';
import { d3Element } from '@core/svg/d3-def-types';
import { d3_svg } from '@core/svg/d3.svg';
import { d3_util } from '@core/svg/d3.util';
import { DiagramTreeNode } from '@core/diagram-tree/diagram-tree-node';
import { AnalysisElementType } from '@core/models/analysis-element';
import { ArchHierarchyNodeDrawer } from '../arch-hierarchy-node-drawer';
import { PairNumber } from '@core/models/arch-data-format';
import { drawThreeGearsFn, drawRectangleFn } from '../arch-hierarchy-node-shape';
import { ArchConfig } from '@core/diagram-impls/element/diagram-element.config';
import { InjectorTreeNode } from '@core/diagram-tree/injector-tree';
import { HierarchyNode } from 'd3';
import { d3_shape } from '@core/svg/d3.shape';

// service has injector, dependency
const _setAttrs = d3_util.setAttrs;
const injectorTexts = { [AnalysisElementType.Module] : 'ModuleInjector', [AnalysisElementType.Component]: 'ElementInjector'};

// service
const serviceNodeColor = ArchConfig.getElementColors(AnalysisElementType.Service)[1];
const serviceNodeName = (node: ArchHierarchyPointNode) => {
  const category = injectorTexts[node.data.elementType];
  return node.data.name + ' ' + (category ? category : 'PlatformInjector');
}

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

export class SecondaryDependencyTree {
  constructor(
    private secondaryLayer: d3Element,
    private rootGroup: d3Element,
    private treeRoot: ArchHierarchyPointNode,
    private layoutOptions: LayoutOptions,
    private nodeDrawer: ArchHierarchyNodeDrawer
  ) {
  }

  drawDependency() {
    const nodes = this.treeRoot.descendants()
      .filter(node => {
        const injector = node.data.getRelatedCtorDependencies();
        return injector && Array.isArray(injector) && injector.length;
      });

    const placeNode = d3_shape.placeNodeFn(dependencyNodeOffset, this.nodeDrawer.nodeSize, false);
    const nodeEnter = this.secondaryLayer
      .selectAll('.secondary_dependency')
      .data(nodes)
      .enter()
      .append('g')
      .classed('secondary_dependency', true)
      .each(function(pointNode: ArchHierarchyPointNode) {
        placeNode.bind(this)(pointNode);
      })
      .call(d3_svg.svgForeignExtendableDiv({text: () => 'Dependencies'}, dependencyNodeSize, null, dependenciesDivAttrs));

    // const rectStyle = {
    //   'stroke': '#888888',
    //   'stroke-width': '1px',
    //   'opacity': '0.8',
    // };

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
