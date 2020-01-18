import * as d3 from 'd3';
import { get } from 'lodash-es';

import { LayoutOptions } from '@core/diagram/layout-options';
import { ArchHierarchyPointNode, ArchHierarchyHelper, ArchHierarchyPointLink, HierarchyPointNodeSelection } from '../arch-hierarchy';
import { d3Element } from '@core/svg/d3-def-types';
import { d3_svg } from '@core/svg/d3.svg';
import { d3_util } from '@core/svg/d3.util';
import { DiagramTreeNode } from '@core/diagram-tree/diagram-tree-node';
import { AnalysisElementType } from '@core/models/analysis-element';
import { ArchHierarchyNodeDrawer } from '../arch-hierarchy-node-drawer';
import { PairNumber, Point } from '@core/models/arch-data-format';
import { drawThreeGearsFn, drawRectangleFn, drawText } from '../arch-hierarchy-node-shape';
import { ArchConfig } from '@core/diagram-impls/element/diagram-element.config';
import { d3_shape } from '@core/svg/d3.shape';

// service has injector, dependency
const _setAttrs = d3_util.setAttrs;
const _setStyles = d3_util.setStyles;

// dependency
const dependencyNodeSize: PairNumber = [96, 22];
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
  'font-weight': '500',
  'cursor': 'pointer'
};

const lineStyle = {
  'stroke': '#1e5799',
  'stroke-width': 1
};
const rectStyle = {
  'stroke': '#888888',
  'stroke-width': '1px',
  'opacity': '1',
  'cursor': 'pointer'
};
const componentColor = ArchConfig.getElementColor(AnalysisElementType.Component);
const providerColor = ArchConfig.getElementColor(AnalysisElementType.Service);
const normalTextColor = '#000000';

const getPositions = (point: any, type: string) => [get(point, `positions.${type}.x`), get(point, `positions.${type}.y`)] as PairNumber;
const setPositions = (node: ArchHierarchyPointNode, type: string, value: PairNumber) => {
  if (!node.hasOwnProperty('positions')) {
    node['positions'] = {};
  }
  if (!node['positions'].hasOwnProperty(type)) {
    node['positions'][type] = {};
  }
  node['positions'][type]['x'] = value[0];
  node['positions'][type]['y'] = value[1];
};
const isValidPosition = (position: PairNumber) => {
  return position && position.length === 2 && position[0] !== null && position[0] !== undefined
    && position[1] !== null && position[1] !== undefined ;
};
const margin = 10;

class DependencyProjector {
  private dependencyHierarchy: ArchHierarchyPointNode;
  private projectorHost: d3Element;
  private projectorLine: d3Element;

  constructor(
    private hostLayer: d3Element,
    private nodeDrawer: ArchHierarchyNodeDrawer,
    private hostNode: ArchHierarchyPointNode
  ) {
    const treeLayout = d3.tree<DiagramTreeNode>();
    treeLayout.nodeSize(this.nodeDrawer.treeNodeSize);

    const dependencyHierarchy = d3.hierarchy(this.hostNode.data._dependencyDiagramTree.root);
    this.dependencyHierarchy = treeLayout(dependencyHierarchy);
  }

  show() {
    d3_svg.transition(this.projectorHost).show();
    d3_svg.transition(this.projectorLine).show();
  }

  hide() {
    d3_svg.transition(this.projectorHost).hide();
    d3_svg.transition(this.projectorLine).hide();
  }

  draw() {
    // projector host
    const { x, y } = this.hostNode;
    this.projectorHost = this.hostLayer.append('g').classed('projector-group', true);
    d3_util.translateTo(this.projectorHost, x, y + 150);

    // link
    const lineOffsetX = dependencyNodeOffset[0] + dependencyNodeSize[0] / 2;
    const targetPosition = { x: x + lineOffsetX, y: y + 150 - 20};
    this.projectorLine = d3_svg.svgLine(this.hostLayer, null, [x + lineOffsetX - 15, y], [targetPosition.x, targetPosition.y], null, lineStyle);
    this.projectorLine.lower();
    const moveLinkTargetFn = d3_svg.moveLineTarget(this.projectorLine);

    // pane rectangle
    const projectorPane = d3_svg.svgRect(this.projectorHost, null, [ 0, 0 ], [ 200, 200 ]);
    const textFn = () => this.hostNode.data.name + ' - Dependency';
    const paneTitle = d3_svg.svgText(this.projectorHost, textFn, null, [0, 0], {'fill': '#1e5799'}, {'font-size': '10px'});

    // links group
    const projectLinksGroup = this.projectorHost.append('g').classed('dependency_links', true);

    // projector nodes
    this.drawNodes();
    // projector links
    this.drawLinks(projectLinksGroup);
    this.projectorHost.lower();

    // pane position and size
    const size = d3_util.getDimension(this.projectorHost);
    const defaultPaneAttrs = { fill: 'lightgray', opacity: 0.5, 'stroke': '#888888', 'stroke-width': '1px' };
    const paneAttrs = { x: size.x - margin, y: size.y - margin,
      width: size.width + 2 * margin, height: size.height + 2 * margin };
    projectorPane.call(_setAttrs, Object.assign({}, defaultPaneAttrs, paneAttrs ));
    // pane title position
    paneTitle.call(_setAttrs, { x: size.x, y: size.y});

    d3_svg.draggable(this.projectorHost, moveLinkTargetFn);
  }

  private drawNodes() {
    const nodeSize = this.nodeDrawer.nodeSize;
    const placeNode = d3_shape.placeNodeFn(dependencyNodeOffset, nodeSize, false);

    // nodes
    const nodes = this.dependencyHierarchy.descendants(); // .filter(node => node.depth > 0);

    const nodeEnter: HierarchyPointNodeSelection = this.projectorHost
      .selectAll('.project-node')
      .data(nodes)
      .enter()
      .append('g')
      .classed('project-node', true)
      .each(function(pointNode: ArchHierarchyPointNode) {
        const place = placeNode.bind(this)(pointNode);
        setPositions(pointNode, 'dependency', [place.x, place.y]);
      });

    nodeEnter
      .filter(ArchHierarchyHelper.isComponent)
      .call((node: HierarchyPointNodeSelection) => {
        drawRectangleFn(nodeSize, rectStyle, false)(node);
        drawText(nodeSize, node, {color: normalTextColor});
        this.nodeDrawer.drawNodeExpandButtonFn(false)(node);
      })
      .call(_setStyles, rectStyle)
      .attr('fill', componentColor);

    nodeEnter
      .filter(ArchHierarchyHelper.isService)
      .call((node: HierarchyPointNodeSelection) => {
        drawRectangleFn(nodeSize, rectStyle, false)(node);
        drawThreeGearsFn()(node);
        drawText(nodeSize, node, {color: normalTextColor});
        this.nodeDrawer.drawNodeExpandButtonFn(false)(node);
      })
      .call(_setStyles, rectStyle)
      .attr('fill', providerColor);
  }

  private drawLinks(projectLinksGroup: d3Element) {
    const nodeSize = this.nodeDrawer.nodeSize;
    const [nodeWidth] = nodeSize;
    const links = this.dependencyHierarchy.links();

    projectLinksGroup
      .selectAll('.dependency_link')
      .data(links)
      .enter()
      .each(function(link: ArchHierarchyPointLink) {
        const host: d3Element = d3.select(this);
        const { source, target } = link;

        let sourcePosition = getPositions(source, 'dependency');
        const targetPosition = getPositions(target, 'dependency');
        if (!isValidPosition(sourcePosition)) {
          sourcePosition = [0, 0];
        }

        if (sourcePosition && targetPosition) {
          sourcePosition[0] += nodeWidth / 2;
          targetPosition[0] += nodeWidth / 2;
          d3_svg.svgLine(host, 'dependency_link', sourcePosition, targetPosition, null, lineStyle);
        }
      });

    return projectLinksGroup;
  }

}

export class SecondaryDependencyTree {
  constructor(
    private secondaryLayer: d3Element,
    private rootGroup: d3Element,
    private treeRoot: ArchHierarchyPointNode,
    private layoutOptions: LayoutOptions,
    private nodeDrawer: ArchHierarchyNodeDrawer,
    private mainLayerCallbacks: { onClickAction: any, zoomFactorFn: any }
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
        pointNode.data.collapseOnly();
        placeNode.bind(this)(pointNode);
      })
      .call(d3_svg.svgForeignExtendableDiv({text: () => 'Dependencies'}, dependencyNodeSize, null, dependenciesDivAttrs));

    const clickFn = this.onClickNode.bind(this);
    d3_shape.createNodeEvent<ArchHierarchyPointNode>(nodeEnter, clickFn, clickFn);
  }

  private onClickNode(diagramNode: ArchHierarchyPointNode) {
    const element = diagramNode.data;

    element.toggleCollapsed();
    if (element.isCollapsed) {
      if (diagramNode.hasOwnProperty('projector')) {
        diagramNode['projector'].hide();
      }
    } else {
      if (diagramNode.hasOwnProperty('projector')) {
        diagramNode['projector'].show();
      } else {
        const projector = new DependencyProjector(this.secondaryLayer, this.nodeDrawer, diagramNode);
        projector.draw();
        diagramNode['projector'] = projector;
      }
    }
  }
}
