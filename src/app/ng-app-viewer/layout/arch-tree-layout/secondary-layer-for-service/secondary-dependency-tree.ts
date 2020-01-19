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
import { PairNumber, Point, ElementBox, toElementBox, RectangleSize } from '@core/models/arch-data-format';
import { drawThreeGearsFn, drawRectangleFn, drawText } from '../arch-hierarchy-node-shape';
import { ArchConfig } from '@core/diagram-impls/element/diagram-element.config';
import { d3_shape } from '@core/svg/d3.shape';

// service has injector, dependency
const _setAttrs = d3_util.setAttrs;
const _setStyles = d3_util.setStyles;
const margin = 10;
const distance = 100;
const minWidth = 200;
const minHeight = 200;

// dependency
const dependencyNodeSize: PairNumber = [86, 22];
const dependencyNodeOffset: PairNumber = [ 25, margin ];
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
const defaultPaneAttrs = {
  'fill': 'lightgray',
  'opacity': 0.5,
  'stroke': '#888888',
  'stroke-width': '1px'
};

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

class DependencyProjector {
  private dependencyHierarchy: ArchHierarchyPointNode;
  private projectorHost: d3Element;
  private projectorLine: d3Element;
  private isOverlayDock = false;

  constructor(
    private hostLayer: d3Element,
    private nodeDrawer: ArchHierarchyNodeDrawer,
    private hostNode: ArchHierarchyPointNode,
    private dock: d3Element
  ) {
    const treeLayout = d3.tree<DiagramTreeNode>();
    treeLayout.nodeSize(this.nodeDrawer.treeNodeSize);

    const dependencyHierarchy = d3.hierarchy(this.hostNode.data._dependencyDiagramTree.root);
    this.dependencyHierarchy = treeLayout(dependencyHierarchy);
  }

  show() {
    d3_svg.transition(this.projectorHost).show();
    this.showLine();
  }

  hide() {
    d3_svg.transition(this.projectorHost).hide();
    this.hideLine();
  }

  showLine() {
    d3_svg.transition(this.projectorLine).show();
  }

  hideLine() {
    d3_svg.transition(this.projectorLine).hide();
  }

  draw() {
    // projector host
    this.projectorHost = this.hostLayer.append('g').classed('projector-group', true).call(_setStyles, { cursor: 'pointer'});
    d3_util.translateTo(this.projectorHost, -1 * distance, distance);

    // links group
    const projectLinksGroup = this.projectorHost.append('g').classed('dependency_links', true);

    // projector nodes
    this.drawNodes();
    // projector links
    this.drawLinks(projectLinksGroup);
    this.projectorHost.lower();

    this.drawPane();
  }

  private drawPane() {
    const dockSize = d3_util.getDimension(this.dock);

    // pane
    const size = d3_util.getDimension(this.projectorHost);
    const paneSize = { x: size.x - margin, y: size.y - margin,
      width: size.width + 2 * margin, height: size.height + 2 * margin };
    paneSize.width = paneSize.width < minWidth ? minWidth : paneSize.width;
    paneSize.height = paneSize.height < minHeight ? minHeight : paneSize.height;

    const lineStart = { x: dependencyNodeSize[0] / 2, y: dependencyNodeSize[1] / 2 };
    const lineEnd = { x: 0, y: distance - 2 * margin};

    // pane rectangle
    d3_svg.svgRect(this.projectorHost, null, [paneSize.x, paneSize.y], [paneSize.width, paneSize.height]).call(_setAttrs, defaultPaneAttrs);
    // pane title
    const textFn = () => this.hostNode.data.name + ' Dependency';
    d3_svg.svgText(this.projectorHost, textFn, null, [size.x, size.y], {'fill': '#1e5799'}, {'font-size': '10px'});

    this.dragPane(lineStart, lineEnd, dockSize, paneSize);
  }

  private dragPane(lineStart: Point, lineEnd: Point, dockSize: RectangleSize, paneSize: RectangleSize) {
    // dock
    const dockBox = toElementBox(dockSize);
    // pane
    const originPaneBox = toElementBox(paneSize);

    const moveLineTarget = (movedLine: d3Element, start: Point) => {
      const lineTarget: Point = { x: parseFloat(movedLine.attr('x2')), y: parseFloat(movedLine.attr('y2'))};
      return (offset: Point, box: ElementBox) => {
        lineTarget.x += offset.x;
        lineTarget.y += offset.y;
        const newTarget = d3_util.findIntersectionOfLineRectangle(start, lineTarget, box);

        const x = newTarget ? newTarget.x : lineTarget.x;
        const y = newTarget ? newTarget.y : lineTarget.y;
        movedLine.attr('x2', x).attr('y2', y);
      };
    };

    // line
    this.projectorLine = d3_svg.svgLine(this.hostLayer, null, [lineStart.x, lineStart.y], [lineEnd.x, lineEnd.y], null, lineStyle);
    this.projectorLine.lower();
    const moveLinkTargetFn = moveLineTarget(this.projectorLine, lineStart);

    const paneBox2 = Object.assign({}, originPaneBox);
    paneBox2.x -= distance;
    paneBox2.y += distance;
    moveLinkTargetFn({x: 0, y: paneSize.height / 2}, paneBox2);

    // drag
    d3_svg.draggable(this.projectorHost, (offset: Point) => {
      // check if projector and dock overlap
      const hostSize = d3_svg.getTranslate(this.projectorHost);
      const newSize = Object.assign({}, originPaneBox);
      newSize.x += hostSize.x;
      newSize.y += hostSize.y;

      const isOverlap = d3_util.isOverlap(dockBox, newSize);
      if (this.isOverlayDock !== isOverlap) {
        this.isOverlayDock = isOverlap;
        isOverlap ? this.hideLine() : this.showLine();
      }

      moveLinkTargetFn(offset, newSize);
    });
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
    const [nodeWidth, nodeHeight] = nodeSize;
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
          sourcePosition[0] += (nodeWidth / 2);
          sourcePosition[1] += (2 * nodeHeight / 3);
          targetPosition[0] += (nodeWidth / 2);
          d3_svg.svgLine(host, 'dependency_link', sourcePosition, targetPosition, null, lineStyle);
        }
      });

    return projectLinksGroup;
  }

}

export class SecondaryDependencyTree {
  private dependencyLayer: d3Element;

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
    const dependencyLayer = this.dependencyLayer = this.secondaryLayer
      .selectAll('.secondary_dependency')
      .data(nodes)
      .enter()
      .append('g')
      .classed('secondary_dependency', true)
      .each(function(pointNode: ArchHierarchyPointNode) {
        pointNode.data.collapseOnly();
        placeNode.bind(this)(pointNode);
      });

    dependencyLayer
      .call(d3_svg.svgForeignExtendableDiv({text: () => 'Dependencies'}, dependencyNodeSize, null, dependenciesDivAttrs));
    const docks = dependencyLayer.select('foreignObject');

    const onClickNode = (diagramNode: ArchHierarchyPointNode, index: number, layers: any[]) => {
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
          const projector = new DependencyProjector(d3.select(layers[index]), this.nodeDrawer, diagramNode, d3.select(docks.nodes()[index]));
          projector.draw();
          diagramNode['projector'] = projector;
        }
      }
    };

    d3_shape.createNodeEvent<ArchHierarchyPointNode>(dependencyLayer, onClickNode, onClickNode);
  }
}
