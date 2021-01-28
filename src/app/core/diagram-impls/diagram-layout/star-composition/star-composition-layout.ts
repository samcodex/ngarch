import * as d3 from 'd3';

import { DiagramLayout } from '@core/diagram/diagram-layout';
import { DiagramLinkableElement, DiagramLink } from '@core/diagram-element-linkable';
import { svg_defs } from '@core/svg/svg-defs';
import { DiagramLinkableContext } from '@core/diagram-element-linkable/diagram-linkable-context';
import { d3_util } from '@core/svg/d3.util';
import { d3Element } from '@core/svg/d3-def-types';
import { ArchConfig } from '@core/diagram-impls/element/diagram-element.config';
import { AnalysisElementType } from '@core/models/analysis-element';
import { rectCollide } from '@core/diagram-impls/libs/force-rect-collide';
import { DiagramElementFeature } from '@core/diagram/diagram-definition';

const nodePadding = { width: 14, height: 6 };
const linkAttrs = {
    'fill': 'none',
    // 'stroke': '#ff8888',
    'stroke': '#C0C0C0',
    'stroke-width': '1.5px'
};
const padding = 3;

export class StarCompositionLayout extends DiagramLayout {
  simulation: d3.Simulation<DiagramLinkableElement, DiagramLink>;

  constructor() {
    super();
  }

  drawLayout(elementContext: DiagramLinkableContext) {
    this.updateStatusNotReady();

    this.createSvgDefs();

    const { nodes, links } = this.createNodesAndLinks(elementContext);
    this.buildForceStarLayout(nodes, links);
  }

  stopLayout() {
    if (this.simulation) {
      this.simulation.stop();
    }
  }

  private createSvgDefs() {
    const board = this.board;
    const defs = board.defs;

    svg_defs.defineDropShadow(defs);
    svg_defs.defineTriangleShape(defs);
    svg_defs.defineArrowShape(defs);
    svg_defs.defineRhombusShape(defs);
  }

  private createNodesAndLinks(elementContext: DiagramLinkableContext) {
    const nodes: DiagramLinkableElement[] = elementContext.elements.filter(element => element);
    const links: DiagramLink[] = elementContext.links.filter(link => link);

    return { nodes, links };
  }

  private buildForceStarLayout(nodes: DiagramLinkableElement[], links: DiagramLink[]) {
    // sizer
    const sizerFn = (size: number, large: number, small: number) =>
      (smallNumber: number, normalNumber: number, largeNumber: number) =>
        size > large ? largeNumber : size < small ? smallNumber : normalNumber;
    const largeSize = 100;
    const smallSize = 12;
    const diagramSize = nodes.length + links.length;
    const sizer = sizerFn(diagramSize, largeSize, smallSize);
    const isLarge = diagramSize >= largeSize;
    const isSmall = diagramSize <= smallSize;

    const nodesStrength = sizer(-1500, -1500, -3500);
    const rootGroup = this.rootGroup;
    const { width, height } = this.boardSize;
    const alphaDecay = sizer(0.3, 0, 1);

    // line Element
    const link = rootGroup.selectAll('line')
      .data(links)
      .enter()
      .insert('line')
      .classed('link', true)
      .call(d3_util.setAttrs, linkAttrs);

    // node Element
    const node = rootGroup.selectAll('g.node')
      .data(nodes)
      .enter()
      .append('g')
      .classed('node', true);

    // Trick, it is required
    const nodeRef: d3Element = node;

    drawNodeSvgElement(node);

    const linkedDistance = (linked: DiagramLink) => {
      const target = linked.target;
      const source = linked.source;
      let distance = sizer(120, 120, 150);

      if (source.getElementType() === AnalysisElementType.Module) {
        if (target.getElementType() === AnalysisElementType.Service) {
          distance = sizer(120, 120, 170);
        } else if (target.getElementType() === source.getElementType()) {
          distance = sizer(150, 150, 350);
        }
      } else {

      }

      return distance;
    };

    // const rectCollision = rectCollide().size(function (d: DiagramHierarchyPointNode) { return [ d.data.width + 20, d.data.height + 20 ]; });
    const rectCollision = rectCollide()
      .size(function (d: DiagramLinkableElement) { return [ 400 , 40 ]; });
    // const boxForce = boundedBox()
    //   .bounds([[0, 0], [width, height]])
    //   .size((d: any) => {
    //     // return [d.width, d.height];
    //     return [200, 30];
    //   });

    const forceLink = d3.forceLink().id((d: any) => d.name).links(links).distance(linkedDistance).strength(1);

    const simulation = this.simulation = d3.forceSimulation<DiagramLinkableElement, DiagramLink>()
      .nodes(nodes)
      .force('charge', d3.forceManyBody().strength(nodesStrength))
      .force('link', forceLink)
      // .force('x', d3.forceX())
      .force('y', d3.forceY())
      .force('center', d3.forceCenter())
      .force('collision', rectCollision)
      // .force('box', boxForce)
      // .alphaDecay(alphaDecay)
      .on('tick', ticked)
      .on('end', () => {
        // drag
        nodeRef.call(d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended));

        // fix position
        nodes.forEach( d => {
          d.nodeLayout.fx = d.x;
          d.nodeLayout.fy = d.y;
        });

        this.updateStatusReady();
      });

    if (isLarge || isSmall) {
      simulation.force('x', d3.forceX());
    }

    // double click
    nodeRef.on('dblclick', function(element: DiagramLinkableElement) {
      const callback = element.getFeatureCallback(DiagramElementFeature.DblClick);
      if (callback) {
        callback.call(null, element.getArchNgPonent());
      }
    });

    function ticked() {
      link.attr('x1', function(d: any) { return d.source.x; })
          .attr('y1', function(d: any) { return d.source.y; })
          .attr('x2', function(d: any) { return d.target.x; })
          .attr('y2', function(d: any) { return d.target.y; });

      node.attr('transform', (d) => `translate(${d.x}, ${d.y})`);
    }

    function dragstarted(d) {
      if (!d3.event.active) {
        simulation.alphaTarget(0.1).restart();
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
      // d.fx = null;
      // d.fy = null;
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }
  }
}

function drawNodeSvgElement(node: d3Element<DiagramLinkableElement, DiagramLinkableElement>) {
  node.append('text')
    .text((pointNode) => pointNode.name)
    .attr('font-size', 11)
    .style('color', 'black')
    .each(function(pointNode) {
      // const $this = this as HTMLElement;
      const $this = this as any;
      const size = $this.getBoundingClientRect();
      const { width, height } = size;
      const nodeLayout = pointNode.nodeLayout;

      nodeLayout.textWidth = width;
      nodeLayout.textHeight = height;
      nodeLayout.rectWidth = nodeLayout.textWidth + nodePadding.width * 2;
      nodeLayout.rectHeight = nodeLayout.textHeight + nodePadding.height * 2;
      nodeLayout.width = nodeLayout.rectWidth + 2;
      nodeLayout.height = nodeLayout.rectHeight + 2;
    })
    .attr('dx', (pointNode) => -pointNode.nodeLayout.textWidth / 2)
    .attr('dy', (pointNode) => pointNode.nodeLayout.textHeight / 2 - 3)
    ;

  node.append('rect')
    .attr('x', (pointNode) => -pointNode.nodeLayout.rectWidth / 2)
    .attr('y', (pointNode) => -pointNode.nodeLayout.rectHeight / 2)
    .attr('width', (pointNode) => pointNode.nodeLayout.rectWidth)
    .attr('height', (pointNode) => pointNode.nodeLayout.rectHeight)
    .attr('fill', function(pointNode) {
      const [elementColor] = ArchConfig.ElementColors[pointNode.getElementType()];
      return elementColor;
    })
    .attr('stroke', '#595959')
    .lower()
    ;

  return node;
}
