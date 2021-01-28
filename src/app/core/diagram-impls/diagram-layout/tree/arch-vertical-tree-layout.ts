import * as d3 from 'd3';

import { DiagramLayout } from '@core/diagram/diagram-layout';
import { DiagramLinkableElement } from '@core/diagram-element-linkable';
import { d3_util } from '@core/svg/d3.util';
import { d3Element } from '@core/svg/d3-def-types';
import { DiagramLinkableContext } from '@core/diagram-element-linkable/diagram-linkable-context';
import { getCallback, LayoutCallbackFlag } from '@core/models/meta-data';
import { LayoutOptions } from '@core/diagram/layout-options';
import { DiagramElementFeature } from '@core/diagram/diagram-definition';

// type
type DiagramNode = d3.HierarchyNode<DiagramLinkableElement>;
type TreePointNode = d3.HierarchyPointNode<DiagramLinkableElement>;     // d3.HierarchyPointNode derived from d3.HierarchyNode

// config layout
const componentHeight = 110;
const pointsOfPolyline100 = componentHeight * 3 / 5;
const nodeSize: [number, number] = [120, 20];
const nodeMargin: [number, number] = [40, 100];

// configuration
const linkStyle = {
  'fill': 'none',
  'stroke': '#888888',
  'stroke-width': '1px'
};

const rectStyle = {
  'fill': '#fff',
  'stroke': '#888888',
  'stroke-width': '1px'
};

const textStyle = {
  'font-size': '12px',
  'overflow-wrap': 'break-word',
  'margin-left': '2px',
  'margin-right': '2px',
  'margin-top': '3px',
  'text-align': 'center',
  'cursor': 'pointer'
};
const textAttr = {
    'dy': '0'
};

export class ArchVerticalTreeLayout extends DiagramLayout {
  private tree: d3.TreeLayout<DiagramLinkableElement>;
  private treeData: DiagramNode;
  private nodes: TreePointNode;

  constructor() {
    super();
  }

  drawLayout(elementContext: DiagramLinkableContext, layoutOptions?: LayoutOptions) {
    this.initTreeDataAndLayout(elementContext, layoutOptions);

    this.drawComponentLinks();

    this.drawComponentNodes();
  }

  private initTreeDataAndLayout(elementContext: DiagramLinkableContext, layoutOptions?: LayoutOptions) {
    const [width, height] = nodeSize;
    const [ marginWidth, marginHeight ] = nodeMargin;
    const { callbacks } = layoutOptions;

    // 1. hierarchy data
    const callback: any = getCallback(callbacks, LayoutCallbackFlag.HierarchyChildrenAccessor);
    this.treeData = d3.hierarchy(elementContext, callback) as d3.HierarchyNode<any>;
    this.treeData.sum( () => 1);

    // 2. tree layout
    this.tree = d3.tree<DiagramLinkableElement>();
    this.tree.nodeSize([width + marginWidth, height + marginHeight]);

    // 3
    this.nodes = this.tree(this.treeData);
  }

  private drawComponentNodes() {
    const descendants = this.nodes.descendants();
    const root = this.rootGroup;
    const [ nodeWidth, nodeHeight ] = nodeSize;

    const node = root
      .selectAll('.node')
      .data(descendants)
      .enter()
      .append('g')
      .classed('node', true);

    node.on('dblclick', function(treeNode: DiagramNode) {
      const element = treeNode.data;
      if (element && 'getFeatureCallback' in element) {
        const callback = element.getFeatureCallback(DiagramElementFeature.DblClick);
        if (callback) {
          callback.call(null, element.getArchNgPonent());
        }
      }
    });

    // node.on('click', function() {
    //   console.log('click');
    // });

    // display text using tspan to wrap text
    // const textNode = node
    //   .append('text')
    //   .classed('com-name', true)
    //   .call(d3_util.setStyles, textStyle)
    //   .call(d3_util.setAttrs, textAttr)
    //   .text((d) => d.data.name)
    //   .each(textComponent)
    //   .call(d3_util.wrapText, nodeWidth)
    //   .each(function(d, i) {
    //     const that = d3.select(this);
    //     const element = that.node() as Element;
    //     const parent = d3.select(element.parentNode);
    //     const lineNumber = that.attr('lineNumber');

    //     if (lineNumber) {
    //       parent.attr('lineNumber', lineNumber);
    //     }
    //   })
    //   ;

    // display text using foreignObject
    const textNode = node
      .append('foreignObject')
      .attr('width', nodeWidth)
      .attr('height', nodeHeight)
      ;
    const foreignDiv = textNode
      .append('xhtml:div')
      .call(d3_util.setStyles, textStyle)
      .text((d) => d.data.name)
      .each(function(d, i) {
        const host: d3Element = d3.select(this);
        const size = d3_util.getRectDimension(host);

        // parent - foreignObject
        const element = host.node() as Element;
        const parent = d3.select(element.parentNode as any);
        const halfWidth = size.width / 2;
        const x = d.x - (halfWidth > nodeWidth / 2 ? (nodeWidth / 2) : halfWidth) ;
        const y = d.y - 10;

        parent
          .attr('x', x - 1)
          .attr('y', y)
          .attr('width', nodeWidth)
          .attr('height', size.height > nodeHeight ? size.height + 8 : nodeHeight);
      })
      ;

    // rectangle shape
    const rect = node.append('rect')
      .classed('name-block', true)
      .call(d3_util.setStyles, rectStyle)
      // .each(calcRectComponent)
      .each(function(d, i) {
        const [width, height] = nodeSize;

        const host: d3Element = d3.select(this);
        const element = host.node() as Element;
        const parent = d3.select(element.parentNode as any);
        const foreignObject = parent.select('foreignObject');
        const foreignHeight = parseInt(foreignObject.attr('height'), 10);

        const x = d.x - width / 2;
        const y = d.y - 10;
        const rectHeight = height < foreignHeight ? foreignHeight : height;

        host.attr('x', x + 1).attr('y', y).attr('width', width).attr('height', rectHeight);
      })
      ;

    textNode.raise();
  }

  private drawComponentLinks() {
    const links = this.nodes.links();
    const root = this.rootGroup;

    root
      .selectAll('polyline.link')
      .data(links)
      .enter()
      .append('polyline')
      .classed('link', true)
      .call(d3_util.setStyles, linkStyle)
      .each(componentPolyline);
  }
}

function componentPolyline(link) {
  const host: d3Element = d3.select(this);
  const { source, target } = link;
  const polyline = [source.x, source.y, source.x, source.y + pointsOfPolyline100,
    target.x, source.y + pointsOfPolyline100, target.x, target.y
  ];
  const points = d3_util.strPoints(polyline);

  host.attr('points', points);
}

// It works. This function is for wrap text using tspan
// function calcRectComponent(node) {
//   const host: d3Element = d3.select(this);
//   const [width, height] = nodeSize;
//   const element = host.node() as Element;
//   const parent = d3.select(element.parentNode);
//   const lineNumber = parseInt(parent.attr('lineNumber'), 10);

//   const x = node.x - width / 2;
//   const y = node.y - 10;
//   const rectHeight = lineNumber && lineNumber > 1 ? height * lineNumber - 10 : height;

//   host.attr('x', x + 1).attr('y', y).attr('width', width).attr('height', rectHeight);
// }

// It works. This function is for tspan
// function textComponent(node) {
//   const [ nodeWidth ] = nodeSize;
//   const host: d3Element = d3.select(this);
//   const size = d3_util.getRectDimension(host);
//   const halfWidth = size.width / 2;
//   const x = node.x - (halfWidth > nodeWidth / 2 ? (nodeWidth / 2 - 5) : halfWidth) ;
//   const y = node.y + 5;

//   host.attr('x', x).attr('y', y);
// }
