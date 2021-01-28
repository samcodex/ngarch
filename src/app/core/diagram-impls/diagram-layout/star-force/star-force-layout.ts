import * as d3 from 'd3';

import { DiagramLayout } from '@core/diagram/diagram-layout';
import { DiagramLinkableContext } from '@core/diagram-element-linkable';
import { forceNodes, forceLinks } from './force-data';
import { d3Element } from '@core/svg/d3-def-types';
import { ArchConfig } from '@core/diagram-impls/element/diagram-element.config';
import { AnalysisElementType } from '@core/models/analysis-element';
import { forceInBox } from '@core/diagram-impls/libs/force-in-box';
import { rectCollide } from '@core/diagram-impls/libs/force-rect-collide';
import { boundedBox } from '@core/diagram-impls/libs/force-bounded-box';

interface NodeType {
  name: string;
  elementType?: AnalysisElementType;
  textWidth?: number;
  textHeight?: number;
  rectWidth?: number;
  rectHeight?: number;
  fullWidth?: number;
  fullHeight?: number;
}

const nodePadding = { width: 14, height: 6 };

// TODO, no used, no finished
export class StarForceLayout extends DiagramLayout {
  private linksGroup: d3Element;
  private nodesGroup: d3Element;

  constructor() {
    super();
  }

  drawLayout(elementContext: DiagramLinkableContext) {
    this.updateStatusNotReady();
    console.log('star-force', elementContext);

    this.initLayout();
    this.drawForceLayout(forceNodes, forceLinks);
  }

  private initLayout() {
    const rootGroup = this.rootGroup;
    // const diagramElements: DiagramElement[] = elementContext.elements;

    this.linksGroup = rootGroup.append('g').attr('class', 'links');
    this.nodesGroup = rootGroup.append('g').attr('class', 'nodes');
    // this.nodesLinks = convertToForceData(diagramElements);
  }

  private drawForceLayout(nodes: any, links: any) {
    const time1 = new Date();
    const size = this.board.getBoardSize();
    const { width, height } = size;
    const center = { x: width / 3, y: height / 2 };
    nodes[0].fx = center.x;
    nodes[0].fy = center.y;

    const linkElement = createLinkSvgElement(this.linksGroup, links);
    const nodeElement = createNodeSvgElement(this.nodesGroup, nodes);
    nodeElement
      .call(
        d3.drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended)
      );

    const rectSize = (node: NodeType) => ([node.fullWidth, node.fullHeight]);
    const linkForce = this.createForceLinkFn(links);
    const collision = this.createCollisionFn();
    const rectCollision = rectCollide()
      .size(function (d) { return [ d.fullWidth + 20, d.fullHeight + 20 ]; });
    const boxForce = boundedBox()
      .bounds([[0, 0], [width, height]])
      .size(rectSize);

    // Instantiate the forceInABox force
    const groupingForce = forceInBox(1)
      .strength(0.1) // Strength to foci
      .template('treemap') // Either treemap or force
      .groupBy('group') // Node attribute to group
      .links(links) // The graph links. Must be called after setting the grouping attribute
      .enableGrouping(true)
      .nodeSize(5) // How big are the nodes to compute the force template
      // .forceCharge(-200) // Separation between nodes on the force template
      .size([width, height]); // Size of the chart

    const simulation = d3.forceSimulation()
      .nodes(nodes)
      .force('charge', d3.forceManyBody().strength(-120).distanceMax(200).distanceMin(120))
      // .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(center.x, center.y))
      // .force('collision', collision)
      .force('collision', rectCollision)
      // .force('box', boxForce)
      // .force('group', groupingForce)
      .force('link', linkForce)
      // .alphaDecay(0)
      .on('tick', tick);

    simulation
      .on('end', () => {
        this.updateStatusReady();
      });

    function tick() {
      const alpha = this.alpha();
      const offsetX = 40 * alpha;
      const offsetY = 20 * alpha;
      nodes.forEach(function(tickedNode, nodeIndex) {
        const type = tickedNode.elementType;
        if (type !== AnalysisElementType.Module) {
          tickedNode.x += type === AnalysisElementType.Service ? offsetX : -offsetX;
          //
        } else {
          tickedNode.y += tickedNode.y > center.y ? offsetY : -offsetY;
        }
      });

      linkElement
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

      nodeElement.attr('transform', (d) => `translate(${d.x}, ${d.y})`);
    }

    function dragstarted(d) {
      if (!d3.event.active) {
        simulation.alphaTarget(0.3).restart();
      }
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) {
        simulation.alphaTarget(0);
      }
      d.fx = null;
      d.fy = null;
    }
  }

  private createCollisionFn(): d3.ForceCollide<any> {
    const collision = d3.forceCollide().radius(function(d: any) {
      return d.fullWidth / 3 * 2;
    });

    return collision;
  }

  private createForceLinkFn(links: { source: any, target: any }[]): d3.ForceLink<any, any> {
    const forceLink = d3.forceLink<any, any>()
      .links(links)
      .id((d: any) => d.name )
      ;

    forceLink
      .distance(function(link) {
      const { source, target } = link;
      if (source.elementType === target.elementType && source.elementType === AnalysisElementType.Module) {
        return 150;
      }
      return 150;
    });

    return forceLink;
  }
}

function createLinkSvgElement(linksGroup: d3Element, links: { source: any, target: any }[]): d3Element {
  const link = linksGroup
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .style('stroke', '#999')
      .attr('stroke-width', function(d) { return 1; });

  return link;
}

function createNodeSvgElement(nodesGroup: d3Element, nodes: NodeType[]): d3Element {
  const node = nodesGroup.selectAll('g')
    .data(nodes)
    .enter()
    .append('g');

  node.append('text')
    .text((d) => d.name)
    .attr('font-size', 11)
    .style('color', 'black')
    .each(function(d) {
      // const $this = this as HTMLElement;
      const $this = this as any;
      const size = $this.getBoundingClientRect();
      const { width, height } = size;
      d.textWidth = width;
      d.textHeight = height;
      d.rectWidth = d.textWidth + nodePadding.width * 2;
      d.rectHeight = d.textHeight + nodePadding.height * 2;
      d.fullWidth = d.rectWidth + 2;
      d.fullHeight = d.rectHeight + 2;
    })
    .attr('dx', (d) => -d.textWidth / 2)
    .attr('dy', (d) => d.textHeight / 2 - 4)
    ;

  node.append('rect')
      .attr('x', (d) => -d.rectWidth / 2)
      .attr('y', (d) => -d.rectHeight / 2)
      .attr('width', (d) => d.rectWidth)
      .attr('height', (d) => d.rectHeight)
      .attr('fill', function(d) {
        const [elementColor] = ArchConfig.ElementColors[d.elementType];
        return elementColor;
      })
      .attr('stroke', '#595959')
      .lower()
      ;

  return node;
}

