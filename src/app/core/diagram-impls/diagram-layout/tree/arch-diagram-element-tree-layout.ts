import * as d3 from 'd3';

import { DiagramLayout } from '@core/diagram/diagram-layout';
import { DiagramLinkableElement } from '@core/diagram-element-linkable';
import { d3_util } from '@core/svg/d3.util';
import { d3_shape } from '@core/svg/d3.shape';
import { d3Element } from '@core/svg/d3-def-types';
import { DiagramLinkableContext } from '@core/diagram-element-linkable/diagram-linkable-context';
import { getCallback, LayoutCallbackFlag } from '@core/models/meta-data';
import { LayoutOptions, Orientation } from '@core/diagram/layout-options';
import { PairNumber, DiagramNodeOptions } from '@core/models/arch-data-format';
import { ArchConfig } from '@core/diagram-impls/element/diagram-element.config';
import { AnalysisElementType } from '@core/models/analysis-element';
import { DiagramElementFeature } from '@core/diagram/diagram-definition';

// type
type DiagramNode = d3.HierarchyNode<DiagramLinkableElement>;
type ArchHierarchyPointNode = d3.HierarchyPointNode<DiagramLinkableElement>;     // d3.HierarchyPointNode derived from d3.HierarchyNode
type ArchHierarchyPointLink = d3.HierarchyPointLink<DiagramLinkableElement>;

// configuration
const linkStyle = {
  'fill': 'none',
  'stroke': '#888888',
  'stroke-width': '1px'
};

const rectStyle = {
  'stroke': '#888888',
  'stroke-width': '1px'
};

const textDivStyle = {
  'font-size': '12px',
  'overflow-wrap': 'break-word',
  'margin-left': '2px',
  'margin-right': '2px',
  'text-align': 'center',
  'cursor': 'pointer',
  'display': 'table-cell',
  'vertical-align': 'middle',
  'word-break': 'break-word'
};

interface OrientationConfig {
  nodeSize: PairNumber;
  nodeMargin: PairNumber;
  getX: (d: ArchHierarchyPointNode) => number;
  getY: (d: ArchHierarchyPointNode) => number;
}

// https://bl.ocks.org/mbostock/3184089
const orientationsConfig: { [key in Orientation]: OrientationConfig } = {
  [ Orientation.TopToBottom ]: {
    nodeSize: [ 180, 60 ],
    nodeMargin: [ 40, 100 ],
    getX: (d: ArchHierarchyPointNode) => d.x,
    getY: (d: ArchHierarchyPointNode) => d.y
  },
  [ Orientation.LeftToRight ]: {
    nodeSize: [ 180, 60 ],
    nodeMargin: [ 80, 50 ],
    getX: (d: ArchHierarchyPointNode) => d.y,
    getY: (d: ArchHierarchyPointNode) => d.x
  }
};

const duration = 750;
const defaultColor = '#fff';

/**
 * TreeLayout version 1
 * It works with DiagramElementContext & DiagramElement
 * with node expandable indicator
 */
export class ArchDiagramElementTreeLayout extends DiagramLayout {
  private rawData: DiagramLinkableContext;
  private treeRoot: DiagramNode;
  private treeLayout: d3.TreeLayout<DiagramLinkableElement>;
  private treeData: ArchHierarchyPointNode;

  private nodeSize: PairNumber;
  private nodeMargin: PairNumber;
  private getX: (d: ArchHierarchyPointNode) => number;
  private getY: (d: ArchHierarchyPointNode) => number;
  private treeNodeSize: PairNumber;
  private layoutOptions: LayoutOptions;

  constructor() {
    super();
  }

  drawLayout(elementContext: DiagramLinkableContext, layoutOptions?: LayoutOptions) {
    // initialize the properties
    this.initProperties(elementContext, layoutOptions);
    // initialize the tree layout and hierarchy data
    this.initTreeLayout();

    // Collapse after the second level
    if (this.treeRoot.children) {
      this.treeRoot.children.forEach(collapse);
    }

    this.updateTreeData();
    this.drawComponentLinks();
    this.drawComponentNodes();
  }

  private initProperties(elementContext: DiagramLinkableContext, layoutOptions: LayoutOptions) {
    this.rawData = elementContext;

    const { orientation = Orientation.TopToBottom } = layoutOptions;
    // const { orientation = Orientation.LeftToRight } = layoutOptions;
    const config = orientationsConfig[orientation];

    this.layoutOptions = layoutOptions;
    this.nodeSize = config.nodeSize;
    this.nodeMargin = config.nodeMargin;
    this.getX = config.getX;
    this.getY = config.getY;

    const [ nodeWidth, nodeHeight ] = this.nodeSize;
    const [ marginWidth, marginHeight ] = this.nodeMargin;

    if (orientation === Orientation.LeftToRight) {
      this.treeNodeSize = [nodeHeight + marginHeight, nodeWidth + marginWidth];
    } else {
      // orientation === Orientation.TopToBottom
      this.treeNodeSize = [nodeWidth + marginWidth, nodeHeight + marginHeight];
    }
  }

  private initTreeLayout() {
    // 1. tree layout
    this.treeLayout = d3.tree<DiagramLinkableElement>();
    this.treeLayout.nodeSize(this.treeNodeSize);

    // 2. hierarchy data
    const { callbacks } = this.layoutOptions;
    const callback: any = getCallback(callbacks, LayoutCallbackFlag.HierarchyChildrenAccessor);
    this.treeRoot = d3.hierarchy(this.rawData, callback) as d3.HierarchyNode<any>;
    this.treeRoot.sum( () => 1);
  }

  private updateTreeData() {
    // Assigns the x and y position for the nodes
    this.treeData = this.treeLayout(this.treeRoot);
  }

  private drawComponentNodes() {
    // Compute the new tree layout.
    const nodes = this.treeData.descendants();
    const root = this.rootGroup;
    const [ nodeWidth, nodeHeight ] = this.nodeSize;
    const getX = this.getX.bind(this);
    const getY = this.getY.bind(this);
    const placeNode = function(d: ArchHierarchyPointNode) {
      const host: d3Element = d3.select(this);
      const x = getX(d) - nodeWidth / 2;
      const y = getY(d);

      d3_util.translateTo(host, x, y);
    };
    const fillRectangleColor = function(pointNode: ArchHierarchyPointNode) {
      const elementType = getElementType(pointNode);
      let color = defaultColor;

      if (elementType) {
        const colors = ArchConfig.ElementColors[elementType];
        const [ lightColor, darkColor ] = colors;
        color = pointNode.hasOwnProperty('_children') && pointNode['_children'] ? darkColor : lightColor;
      }

      return color;
    };

    const elementOptions: DiagramNodeOptions = {
      size: this.nodeSize
    };

    // Update the nodes...
    const node = root
      .selectAll('.node')
      .data(nodes) as d3.Selection<SVGGElement, d3.HierarchyPointNode<DiagramLinkableElement<any>>, d3.BaseType, any>;

    // Enter any new modes
    const nodeEnter = node
      .enter()
      .append('g')
      .classed('node', true)
      .each(placeNode)
      .each(function(pointNode) {
        const host = d3.select(this);
        let ponent = pointNode.data;
        if (ponent) {
          if (ponent instanceof DiagramLinkableContext ) {
            ponent = ponent.rootElement && ponent.rootElement instanceof DiagramLinkableElement
              ? ponent.rootElement : null;
          }
        }

        if (ponent) {
          ponent.drawTo(null, host, null, elementOptions);
        } else {
          drawDefaultSharp();
        }
      });

    // click and double click event handlers
    const eventHandler = d3_shape.clickAndDblclick();
    nodeEnter.call(eventHandler);
    eventHandler.on('dblclick', function(treeNode: DiagramNode) {
      const element = treeNode.data;
      if (element && 'getFeatureCallback' in element) {
        const callback = element.getFeatureCallback(DiagramElementFeature.DblClick);
        if (callback) {
          callback.call(null, element.getArchNgPonent());
        }
      }
    });

    eventHandler.on('click', (treeNode: DiagramNode) => {
      clickTreeNode(treeNode);
      this.updateTreeData();
      this.drawComponentLinks();
      this.drawComponentNodes();
    });

    // display text using foreignObject
    // const textNode = nodeEnter
    //   .append('foreignObject')
    //   .attr('width', nodeWidth);

    // // div for text
    // textNode
    //   .append('xhtml:div')
    //   .text((d) => d.data.name)
    //   .call(d3_util.setStyles, textDivStyle)
    //   .style('width', nodeWidth + 'px')
    //   .each(function(d, i) {
    //     const host: d3Element = d3.select(this);
    //     const size = d3_util.getRectDimension(host);

    //     // parent - foreignObject
    //     const element = host.node() as Element;
    //     const parent = d3.select(element.parentNode as any);

    //     const divHeight = size.height > nodeHeight ? size.height + 4 : nodeHeight;
    //     parent.attr('height', divHeight);
    //     host.style('height', divHeight + 'px');
    //   })
    //   ;

    // nodeEnter
    //   .append('polygon')
    //   .attr('points', function(pointNode) {
    //     const moduleTab = isSameElementType(pointNode, AnalysisElementType.Module)
    //       ? `${nodeWidth - 26},0 ${nodeWidth - 24},-8 ${nodeWidth - 2},-8` : '';
    //     const commands = `0,0 ${moduleTab} ${nodeWidth},0 ${nodeWidth},${nodeHeight} 0,${nodeHeight} 0,0`;

    //     return commands;
    //   })
    //   .call(d3_util.setStyles, rectStyle)
    //   .attr('fill', fillRectangleColor)
    //   ;

    // // expand indicator
    // nodeEnter
    //   .filter((pointNode: any) => pointNode.hasOwnProperty('_children') && pointNode['_children'])
    //   .append('path')
    //   .attr('d', function(pointNode) {
    //     return `M${nodeWidth} 10 Q ${nodeWidth + 12} 17 ${nodeWidth} 25`;
    //   })
    //   .attr('fill', fillRectangleColor)
    //   .call(d3_util.setStyles, rectStyle);

    const nodeUpdate = nodeEnter.merge(node);

    // Transition to the proper position for the node
    nodeUpdate.transition()
      .duration(duration)
      .each(placeNode);

    nodeUpdate.raise();
    // textNode.raise();

    node.exit().remove();

    function drawDefaultSharp() {
      // display text using foreignObject
      const textNode = nodeEnter
        .append('foreignObject')
        .attr('width', nodeWidth);

      // div for text
      textNode
        .append('xhtml:div')
        .text((d) => d.data.name)
        .call(d3_util.setStyles, textDivStyle)
        .style('width', nodeWidth + 'px')
        .each(function(d, i) {
          const host: d3Element = d3.select(this);
          const size = d3_util.getRectDimension(host);

          // parent - foreignObject
          const element = host.node() as Element;
          const parent = d3.select(element.parentNode as any);

          const divHeight = size.height > nodeHeight ? size.height + 4 : nodeHeight;
          parent.attr('height', divHeight);
          host.style('height', divHeight + 'px');
        })
        ;

      nodeEnter
          .append('polygon')
          .attr('points', function(pointNode) {
            const moduleTab = isSameElementType(pointNode, AnalysisElementType.Module)
              ? `${nodeWidth - 26},0 ${nodeWidth - 24},-8 ${nodeWidth - 2},-8` : '';
            const commands = `0,0 ${moduleTab} ${nodeWidth},0 ${nodeWidth},${nodeHeight} 0,${nodeHeight} 0,0`;

            return commands;
          })
          .call(d3_util.setStyles, rectStyle)
          .attr('fill', fillRectangleColor)
          ;

        // expand indicator
      nodeEnter
          .filter((pointNode: any) => pointNode.hasOwnProperty('_children') && pointNode['_children'])
          .append('path')
          .attr('d', function(pointNode) {
            return `M${nodeWidth} 10 Q ${nodeWidth + 12} 17 ${nodeWidth} 25`;
          })
          .attr('fill', fillRectangleColor)
          .call(d3_util.setStyles, rectStyle);

      textNode.raise();
    }
  }

  private drawComponentLinks() {
    // Compute the new tree layout.
    const links = this.treeData.links();
    const root = this.rootGroup;
    const getX = this.getX.bind(this);
    const getY = this.getY.bind(this);
    const { orientation } = this.layoutOptions;
    const [ nodeWidth, nodeHeight ] = this.nodeSize;
    const [ marginWidth, marginHeight ] = this.nodeMargin;
    const halfNodeWidth = nodeWidth / 2;
    const halfNodeHeight = nodeHeight / 2;
    const halfMarginWidth = marginWidth / 2;
    const halfMarginHeight = marginHeight / 2;

    const calcPoints = function(treeLink: ArchHierarchyPointLink) {
        const { source, target } = treeLink;
        // const polyline = [source.x, source.y, source.x, source.y + pointsOfPolyline100,
        //   target.x, source.y + pointsOfPolyline100, target.x, target.y
        // ];
        const sourceX = getX(source), sourceY = getY(source), targetX = getX(target), targetY = getY(target);

        let startPoint: PairNumber, secondPoint: PairNumber, thirdPoint: PairNumber, endPoint: PairNumber;
        if (orientation === Orientation.LeftToRight) {
          startPoint = [ sourceX, sourceY + halfNodeHeight ];
          secondPoint = [ sourceX + halfNodeWidth + halfMarginWidth, sourceY + halfNodeHeight ];
          thirdPoint = [ sourceX + halfNodeWidth + halfMarginWidth, targetY + halfNodeHeight ];
          endPoint = [ targetX, targetY + halfNodeHeight ];
        } else {
          // orientation === Orientation.TopToBottom
          startPoint = [ sourceX, sourceY];
          secondPoint = [ sourceX, sourceY + halfNodeHeight + halfMarginHeight ];
          thirdPoint = [ targetX, sourceY + halfNodeHeight + halfMarginHeight ];
          endPoint = [ targetX, targetY ];
        }

        const polyline = [ ...startPoint, ...secondPoint, ...thirdPoint, ...endPoint];
        const points = d3_util.strPoints(polyline);

        return points;
      };

    const link = root
      .selectAll('polyline.link')
      .data(links) as d3.Selection<SVGPolylineElement, d3.HierarchyPointLink<any>, d3.BaseType, any>;

    const linkEnter = link
      .enter()
      .append('polyline')
      .classed('link', true)
      .call(d3_util.setStyles, linkStyle)
      .attr('points', calcPoints);

    const linkUpdate = linkEnter.merge(link);
    linkUpdate.attr('points', calcPoints);

    link.exit().remove();
  }
}

// Toggle children on click.
function clickTreeNode(d: any) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
}

// Collapse the node and all it's children
function collapse(d: any) {
  if (d.children) {
    d._children = d.children;
    d._children.forEach(collapse);
    d.children = null;
  }
}

function getElementType(pointNode: ArchHierarchyPointNode) {
  const element = pointNode.data;
  return 'getElementType' in element ? element.getElementType() : null;
}

function isSameElementType(pointNode: ArchHierarchyPointNode, checkType: AnalysisElementType) {
  const elementType = getElementType(pointNode);
  return elementType === checkType;
}
