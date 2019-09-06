// import * as d3 from 'd3';

// import { DiagramLayout } from '@core/diagram/diagram-layout';
// import { DiagramElement, DiagramOptions, DiagramLink } from '@core/diagram-element';
// import { svg_defs } from '@core/svg/svg-defs';
// import { DiagramElementContext } from '@core/diagram-element/diagram-element-context';
// import { d3Element, d3_util } from '@core/svg/d3.util';
// import { ArchConfig } from '@core/diagram-impls/element/diagram-element.config';
// import { AnalysisElementType } from '@core/models/analysis-element';
// // import { forceNodes, forceLinks } from '../star-force/force-data';
// // import { boundedBox } from '@core/diagram-impls/libs/force-bounded-box';
// import { rectCollide } from '@core/diagram-impls/libs/force-rect-collide';

// const nodePadding = { width: 14, height: 6 };
// const linkAttrs = {
//     'fill': 'none',
//     // 'stroke': '#ff8888',
//     'stroke': '#C0C0C0',
//     'stroke-width': '1.5px'
// };
// const padding = 3;

// // type DiagramHierarchyNode = d3.HierarchyNode<DiagramElement>;
// // type DiagramHierarchyPointNode = d3.HierarchyPointNode<DiagramElement>;
// // type DiagramHierarchyPointLink = d3.HierarchyPointLink<DiagramElement>;

// export class StarCompositionLayout extends DiagramLayout {
//   simulation: d3.Simulation<DiagramElement, DiagramLink>;

//   constructor() {
//     super();
//   }

//   drawLayout(elementContext: DiagramElementContext, diagramOptions?: DiagramOptions) {
//     this.updateStatusNotReady();

//     const diagramElements: DiagramElement[] = elementContext.elements.filter(element => element);
//     const diagramLinks: DiagramLink[] = elementContext.links.filter(link => link);

//     const { nodes, links } = this.createNodesAndLinks(elementContext);
//     // const { nodes, links } = this.createHierarchyNodesAndLinks(diagramElements);
//     // const nodes = forceNodes;
//     // const links = forceLinks;

//     this.clearRootGroupContent();
//     this.createSvgDefs();

//     this.buildForceStarLayout(nodes, links);
//   }

//   stopLayout() {
//     if (this.simulation) {
//       this.simulation.stop();
//     }
//   }

//   private clearRootGroupContent() {
//     this.rootGroup.selectAll('line').remove();
//     this.rootGroup.selectAll('g.node').remove();
//   }

//   private createSvgDefs() {
//     const board = this.board;
//     const defs = board.defs;

//     svg_defs.defineDropShadow(defs);
//     svg_defs.defineTriangleShape(defs);
//     svg_defs.defineArrowShape(defs);
//     svg_defs.defineRhombusShape(defs);
//   }

//   private createHierarchyNodesAndLinks(diagramElements: DiagramElement[]) {
//     const { width, height } = this.boardSize;
//     const rootElement = diagramElements[0];
//     const children = (element: DiagramElement) => element.getChildrenOf();

//     const hierarchy = d3.hierarchy(rootElement, children);
//     const treeLayout = d3.tree<DiagramElement>();
//     treeLayout.size([width, height]);
//     const treeRoot = treeLayout(hierarchy);
//     const links = treeRoot.links();
//     const nodes = treeRoot.descendants();

//     return { nodes, links };
//   }

//   private createNodesAndLinks(elementContext: DiagramElementContext) {
//     const nodes: DiagramElement[] = elementContext.elements.filter(element => element);
//     const links: DiagramLink[] = elementContext.links.filter(link => link);

//     return { nodes, links };
//   }

//   private buildForceStarLayout(nodes: DiagramElement[], links: DiagramLink[]) {
//     // sizer
//     const sizerFn = (size: number, large: number, small: number) =>
//       (smallNumber: number, normalNumber: number, largeNumber: number) =>
//         size > large ? largeNumber : size < small ? smallNumber : normalNumber;
//     const largeSize = 100;
//     const smallSize = 12;
//     const diagramSize = nodes.length + links.length;
//     const sizer = sizerFn(diagramSize, largeSize, smallSize);

//     const nodesStrength = sizer(-30, -1500, -2500);
//     const rootGroup = this.rootGroup;
//     const { width, height } = this.boardSize;
//     const alphaDecay = sizer(0.3, 0.01, 0);

//     const linkedDistance = (linked: DiagramLink) => {
//       const target = linked.target;
//       const source = linked.source;
//       let distance = sizer(50, 100, 150);

//       if (source.analyzedElementType === AnalysisElementType.Module) {
//         if (target.analyzedElementType === AnalysisElementType.Service) {
//           distance = sizer(50, 120, 170);
//         } else if (target.analyzedElementType === source.analyzedElementType) {
//           distance = sizer(50, 150, 200);
//         }
//       } else {

//       }
// console.log('distance', distance);

//       return distance;
//     };

//     // const rectCollision = rectCollide().size(function (d: DiagramHierarchyPointNode) { return [ d.data.width + 20, d.data.height + 20 ]; });
//     const rectCollision = rectCollide()
//       .size(function (d: DiagramElement) { return [ 400 , 40 ]; });
//     // const boxForce = boundedBox()
//     //   .bounds([[0, 0], [width, height]])
//     //   .size((d: any) => {
//     //     // return [d.width, d.height];
//     //     return [200, 30];
//     //   });

//     const forceLink = d3.forceLink().id((d: any) => d.name).links(links).distance(linkedDistance).strength(1);

//     const simulation = this.simulation = d3.forceSimulation<DiagramElement, DiagramLink>()
//       .nodes(nodes)
//       .force('charge', d3.forceManyBody().strength(nodesStrength))
//       .force('link', forceLink)
//       // .force('x', d3.forceX())
//       .force('y', d3.forceY())
//       .force('center', d3.forceCenter())
//       .force('collision', rectCollision)
//       // .force('box', boxForce)
//       // .alphaDecay(alphaDecay)
//       .on('tick', ticked)
//       .on('end', () => {
//         this.updateStatusReady();
//       });

//     const link = rootGroup.selectAll('line')
//       .data(links)
//       .enter()
//       .insert('line')
//       .classed('link', true)
//       .call(d3_util.setAttrs, linkAttrs)
//       ;

//     const node = rootGroup.selectAll('g.node')
//       .data(nodes)
//       .enter()
//       .append('g')
//       .classed('node', true);

//     const nodeRef: d3Element = node;
//     nodeRef.call(d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended));

//     drawNodeSvgElement(node);

//     function ticked() {
//       const alpha = this.alpha();
//       const k = 40 * alpha;
//       // const quadtree = d3.quadtree<DiagramHierarchyPointNode>().addAll(nodes);
// // console.log(quadtree);
//       // console.log(quadtree);
//       // nodes.forEach(d => {
//       //   d.y -= k;
//       //   d.y += k;
//       // });


//       // const q = d3.quadtree<DiagramHierarchyPointNode>().addAll(nodes);
//       // // const q = d3.quadtree(nodes);
//       // const n = nodes.length;
//       // let i = 0;

//       // while (++i < n) {
//       //   q.visit(collide(nodes[i]));
//       // }

//       link.attr('x1', function(d: any) { return d.source.x; })
//           .attr('y1', function(d: any) { return d.source.y; })
//           .attr('x2', function(d: any) { return d.target.x; })
//           .attr('y2', function(d: any) { return d.target.y; });

//       // node.attr('cx', function(d) { return d.x; })
//       //     .attr('cy', function(d) { return d.y; });

//       node.attr('transform', (d) => `translate(${d.x}, ${d.y})`);
//     }

//     function dragstarted(d) {
//       if (!d3.event.active) {
//         simulation.alphaTarget(1).restart();
//       }
//       d.fx = d.x;
//       d.fy = d.y;
//     }

//     function dragged(d) {
//       d.fx = d3.event.x;
//       d.fy = d3.event.y;
//     }

//     function dragended(d) {
//       if (!d3.event.active) {
//         simulation.alphaTarget(0);
//       }
//       // d.fx = null;
//       // d.fy = null;
//       d.fx = d3.event.x;
//       d.fy = d3.event.y;
//     }
//   }
// }

// function drawNodeSvgElement(node: d3Element<DiagramElement, DiagramElement>) {
//   node.append('text')
//     .text((pointNode) => pointNode.name)
//     .attr('font-size', 11)
//     .style('color', 'black')
//     .each(function(pointNode) {
//       const $this = this as HTMLElement;
//       const size = $this.getBoundingClientRect();
//       const { width, height } = size;
//       const nodeLayout = pointNode.nodeLayout;

//       nodeLayout.textWidth = width;
//       nodeLayout.textHeight = height;
//       nodeLayout.rectWidth = nodeLayout.textWidth + nodePadding.width * 2;
//       nodeLayout.rectHeight = nodeLayout.textHeight + nodePadding.height * 2;
//       nodeLayout.width = nodeLayout.rectWidth + 2;
//       nodeLayout.height = nodeLayout.rectHeight + 2;
//     })
//     .attr('dx', (pointNode) => -pointNode.textWidth / 2)
//     .attr('dy', (pointNode) => pointNode.textHeight / 2 - 3)
//     ;

//   node.append('rect')
//     .attr('x', (pointNode) => -pointNode.rectWidth / 2)
//     .attr('y', (pointNode) => -pointNode.rectHeight / 2)
//     .attr('width', (pointNode) => pointNode.rectWidth)
//     .attr('height', (pointNode) => pointNode.rectHeight)
//     .attr('fill', function(pointNode) {
//       const [elementColor] = ArchConfig.ElementColors[pointNode.getElementType()];
//       return elementColor;
//     })
//     .attr('stroke', '#595959')
//     .lower()
//     ;

//   return node;
// }

// // function collide(node) {
// //   return function(quad, x1, y1, x2, y2) {
// //     let updated = false;
// //     if (quad.point && (quad.point !== node)) {
// //       let x = node.x - quad.point.x,
// //         y = node.y - quad.point.y;
// //       const xSpacing = (quad.point.width + node.width) / 2,
// //         ySpacing = (quad.point.height + node.height) / 2,
// //         absX = Math.abs(x),
// //         absY = Math.abs(y);
// //       let l, lx, ly;

// //       if (absX < xSpacing && absY < ySpacing) {
// //         l = Math.sqrt(x * x + y * y);

// //         lx = (absX - xSpacing) / l;
// //         ly = (absY - ySpacing) / l;

// //         // the one that's barely within the bounds probably triggered the collision
// //         if (Math.abs(lx) > Math.abs(ly)) {
// //           lx = 0;
// //         } else {
// //           ly = 0;
// //         }

// //         node.x -= x *= lx;
// //         node.y -= y *= ly;
// //         quad.point.x += x;
// //         quad.point.y += y;

// //         updated = true;
// //       }
// //     }
// //     return updated;
// //   };
// // }
