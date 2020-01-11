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

// injector
const injectorNodeSize: PairNumber = [120, 32];
const injectorNodeOffset: PairNumber = [ -25, -5 ];
const injectorText = (node: ArchHierarchyPointNode) => injectorTexts[node.data.elementType];

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

const lineStyle = {
  'stroke': '#1e5799',
  'stroke-width': 2
};

const getPosition = (point: any) => [point.positions.injector.x, point.positions.injector.y] as PairNumber;
const startPointOffset = [injectorNodeSize[0] / 2, injectorNodeSize[1] - 4];
const endPointOffset = [ injectorNodeSize[0] / 2, 1];

export class SecondaryInjectorTree {
  private injectorHierarchy: d3.HierarchyNode<InjectorTreeNode>;

  constructor(
    private secondaryLayer: d3Element,
    private rootGroup: d3Element,
    private treeRoot: ArchHierarchyPointNode,
    private layoutOptions: LayoutOptions,
    private nodeDrawer: ArchHierarchyNodeDrawer
  ) {
  }

  drawInjector() {
    const root = this.treeRoot.data;
    const injectorTree = root.injectorSubTree;
    const injectorRoot = injectorTree.root;
    this.injectorHierarchy = d3.hierarchy(injectorRoot, (injectorNode) => injectorNode.isCollapsed ? null : injectorNode.children);

    this.drawInjectorNodes();

    const linksGroup = this.drawInjectorLinks();
    linksGroup.lower();
  }

  private drawInjectorNodes() {
    const nodes = this.injectorHierarchy.descendants();
    const rootModuleNode = nodes.find(node => node.data.rootModule);

    // two PlatformInjector, NullInjector & PlatformModuleInjector
    let count = 2;
    const placeNode = d3_shape.placeNodeFn(injectorNodeOffset, this.nodeDrawer.nodeSize);
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
          const injectorPosition = placeNode.bind(this)(hostPoint, offset);
          if (!pointNode.hasOwnProperty('positions')) {
            pointNode['positions'] = {};
          }
          pointNode['positions']['injector'] = injectorPosition;
        }
      })
      .call(d3_svg.svgForeignExtendableDiv({text: serviceNodeName}, injectorNodeSize, null, injectorDivAttrs));
  }

  private drawInjectorLinks() {
    const links = this.injectorHierarchy.links();
    const injectorLinksGroup = this.secondaryLayer.append('g').classed('injector_links', true);
    const linkEnter = injectorLinksGroup.selectAll('link').data(links).enter();

    linkEnter
      .each(function(link) {
        const host: d3Element = d3.select(this);
        const { source, target } = link;
        const startPoint: PairNumber = getPosition(source);
        const endPoint: PairNumber = getPosition(target);
        startPoint[0] += startPointOffset[0];
        startPoint[1] += startPointOffset[1];
        endPoint[0] += endPointOffset[0];
        endPoint[1] += endPointOffset[1];

        d3_svg.svgLine(host, null, startPoint, endPoint, null, lineStyle);
      });

    return injectorLinksGroup;
  }
}
