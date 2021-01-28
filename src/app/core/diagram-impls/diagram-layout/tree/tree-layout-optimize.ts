import { DiagramLinkableElement } from '@core/diagram-element-linkable';
import { RectangleSize, Point } from '@core/models/arch-data-format';
import { d3Element } from '@core/svg/d3-def-types';
import * as d3 from 'd3';

interface NodeLayout extends d3.HierarchyPointNode<DiagramLinkableElement> {
  nodeShape: RectangleSize;
  textPosition: Point;
}

interface LevelContext {
  leftPadding: number;
  nodeLayouts: NodeLayout[];
}


class TreeStatus {
  depth = 0;
  treeX = 0;
  treeWidth = 0;
  treeHeight = 0;

  levels: LevelContext[] = [];

  constructor() {}

  // analyse(nodes: TreePointNode) {
  //   let currentDepth = -1;
  //   let currentWidth = 0;

  //   nodes.each((node) => {
  //     const depth = node.depth;

  //     this.depth = Math.max(this.depth, depth);
  //     this.treeX = Math.max(this.treeX, node.x);

  //     if (currentDepth !== depth) {
  //       currentWidth = 0;
  //       currentDepth = depth;
  //       this.treeHeight = node.y;
  //     }
  //     currentWidth += calcObject(nodeHorizontalMargin) + calcObject(nodeHorizontalPadding) + calcNodeWidth(node);

  //     this.treeWidth = Math.max(this.treeWidth, currentWidth);
  //   });

  //   if (this.levels.length === 0) {
  //     this.analyseLevel(nodes);
  //   }
  // }

  // analyseLevel(nodes: TreePointNode) {
  //   let currentDepth = -1;
  //   let context, nodeLayouts, nodeLayout;
  //   let prevWidth = 0;

  //   nodes.each((node) => {
  //     const depth = node.depth;

  //     if (currentDepth !== depth) {
  //       currentDepth = depth;
  //       nodeLayouts = [];

  //       context = {
  //         leftPadding: 0,
  //         nodeLayouts: nodeLayouts
  //       };
  //       this.levels.push(context);
  //     }

  //     if (nodeLayouts.length === 0) {
  //       prevWidth = 0;
  //     }

  //     nodeLayout = {
  //       nodeShape: {},
  //       textPosition: {}
  //     };

  //     nodeLayouts.push(nodeLayout);
  //   });
  // }
}

function straight(link) {
  const host: d3Element = d3.select(this);

  host
    .attr('x1', link.source.x)
    .attr('y1', link.source.y)
    .attr('x2', link.target.x)
    .attr('y2', link.target.y);
}

function rectComponent(node) {
  const host: d3Element = d3.select(this);
  const x = node.x - 50;
  const y = node.y - 10;
  const width = 100;
  const height = 20;

  host.attr('x', x).attr('y', y).attr('width', width).attr('height', height);
}

// It works!!! and require append('path')
// function diagonal(link) {
//   const host: d3Element = d3.select(this);
//   const source = link.source;
//   const target = link.target;

//   const path = `M${source.x},${source.y}C${source.x},${target.y} ${target.x},${target.y + 100} ${target.x},${target.y}`;
//   // const path = 'M' + getNodeXy(node)
//   //     + 'C' + xy( node.x, parent.y + 100)
//   //     + ' ' + xy( parent.x, parent.y + 100)
//   //     + ' ' + getNodeXy(parent);

//   console.log(path);
//   host.attr('d', path);
// }
