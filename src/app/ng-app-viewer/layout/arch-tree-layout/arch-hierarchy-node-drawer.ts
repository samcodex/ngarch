import * as d3 from 'd3';

import { ArchHierarchyPointNode, HierarchyPointNodeSelection, ArchHierarchyHelper, ArchHierarchy } from './arch-hierarchy';
import { d3_util } from '@core/svg/d3.util';
import { D3Transform, D3PathAttr } from '@core/svg/d3-def-types';
import { PairNumber } from '@core/models/arch-data-format';
import { ArchConfig } from '@core/diagram-impls/element/diagram-element.config';
import { Orientation, NodeInfoLevel } from '@core/diagram/layout-options';
import { d3_shape } from '@core/svg/d3.shape';
import { d3_svg } from '@core/svg/d3.svg';
import { firstGearOfTwo, secondGearOfTwo } from '@core/svg/svg-defs';
import { ArchNgPonentInjectable } from '@core/arch-ngponent/arch-ngponent-injectable';

// types

interface ContentNodes {
  container: HierarchyPointNodeSelection;
  header: HierarchyPointNodeSelection;
  main: HierarchyPointNodeSelection;
  footer: HierarchyPointNodeSelection;
}

type MapNodeToNumber = (d: ArchHierarchyPointNode) => number;
interface OrientationConfig {
  getX: MapNodeToNumber;
  getY: MapNodeToNumber;
}
interface StyleConfig {
  nodeSize: PairNumber;
  nodeMargin: PairNumber;
}

// configuration
export const linkStyle = {
  'fill': 'none',
  'stroke': '#888888',
  'stroke-width': '1px'
};

export const linkCoverStyle = {
  'fill': 'none',
  'stroke': 'red',
  'stroke-width': '10px',
  'stroke-opacity': '0'
};

export const duration = 750;

const rectStyle = {
  'stroke': '#888888',
  'stroke-width': '1px'
};

const textDivStyle = {
  'font-size': '10px',
  'margin-left': '2px',
  'margin-right': '2px',
  'text-align': 'center',
  // 'cursor': 'pointer',
  'display': 'table-cell',
  'vertical-align': 'middle',
  'font-weight': '500'
};
const textMainStyle = {
  'font-size': '9px',
  'margin-top': '1px',
  'margin-left': '1px',
  'margin-right': '2px',
  'padding-left': '2px',
  'text-align': 'left',
  'cursor': 'pointer',
  'display': 'table-cell',
  'vertical-align': 'middle',
};

const svgTextStyle = {
  'font-size': '10px',
  'stroke': 'none',
  'fill': 'black',
  'font-weight': '600'
};

// https://bl.ocks.org/mbostock/3184089
const orientationsConfig: { [key in Orientation]: OrientationConfig } = {
  [ Orientation.TopToBottom ]: {
    getX: (d: ArchHierarchyPointNode) => d.x,
    getY: (d: ArchHierarchyPointNode) => d.y
  },
  [ Orientation.LeftToRight ]: {
    getX: (d: ArchHierarchyPointNode) => d.y,
    getY: (d: ArchHierarchyPointNode) => d.x
  }
};
const simpleStyleConfig: { [key in Orientation]: StyleConfig } = {
  [ Orientation.TopToBottom ]: {
    nodeSize: [ 110, 38 ],
    nodeMargin: [ 30, 70 ]
  },
  [ Orientation.LeftToRight ]: {
    nodeSize: [ 110, 38 ],
    nodeMargin: [ 70, 45 ]
  }
};
const detailProviderStyleConfig: { [key in Orientation]: StyleConfig } = {
  [ Orientation.TopToBottom ]: {
    nodeSize: [ 160, 80 ],
    nodeMargin: [ 30, 70 ]
  },
  [ Orientation.LeftToRight ]: {
    nodeSize: [ 160, 80 ],
    nodeMargin: [ 70, 45 ]
  }
};

const nodeActionWidth = 5;
const routesEllipseSize: PairNumber = [ 100, 40 ];

export class ArchHierarchyNodeDrawer {
  private _orientation: Orientation;
  private _infoLevel: NodeInfoLevel;

  private orientationConfig: OrientationConfig;
  private styleConfig: StyleConfig;

  private routesEllipseSize: PairNumber = routesEllipseSize;

  private _treeNodeSize: PairNumber;

  constructor(orientation: Orientation, type: NodeInfoLevel = NodeInfoLevel.Basic) {
    this._orientation = orientation;
    this._infoLevel = type;

    this.orientationConfig = orientationsConfig[orientation];
    const styleConfig = type === NodeInfoLevel.Detail ? detailProviderStyleConfig : simpleStyleConfig;
    this.styleConfig = styleConfig[orientation];

    const [ nodeWidth, nodeHeight ] = this.styleConfig.nodeSize;
    const [ marginWidth, marginHeight ] = this.styleConfig.nodeMargin;
    if (orientation === Orientation.LeftToRight) {
      this._treeNodeSize = [nodeHeight + marginHeight, nodeWidth + marginWidth];
    } else {
      // orientation === Orientation.TopToBottom
      this._treeNodeSize = [nodeWidth + marginWidth, nodeHeight + marginHeight];
    }
  }

  get treeNodeSize(): PairNumber {
    return this._treeNodeSize;
  }

  get getX(): (d: ArchHierarchyPointNode) => number {
    return this.orientationConfig.getX;
  }

  get getY(): (d: ArchHierarchyPointNode) => number {
    return this.orientationConfig.getY;
  }

  get orientation(): Orientation {
    return this._orientation;
  }

  get nodeSize(): PairNumber {
    return this.styleConfig.nodeSize;
  }

  get nodeMargin(): PairNumber {
    return this.styleConfig.nodeMargin;
  }

  getNodePosition (pointNode: ArchHierarchyPointNode, offset: PairNumber = [0, 0]): PairNumber {
    const [ x, y ] = offset;
    return [ this.getX(pointNode) + x, this.getY(pointNode) + y ];
  }

  drawNodeShape(nodeEnter: HierarchyPointNodeSelection) {
    const [ nodeWidth, nodeHeight ] = this.nodeSize;

    const isOthers = (d: ArchHierarchyPointNode) => !ArchHierarchyHelper.isModule(d)
      && !ArchHierarchyHelper.isRoutes(d) && !ArchHierarchyHelper.isRoute(d);
    const hasBottomLine = (dNode: ArchHierarchyPointNode) => !!dNode.data.bottomLine;

    // Module shape
    nodeEnter
      .filter(ArchHierarchyHelper.isModule)
      .call(drawModuleFn(this.nodeSize));

    // ellipse shape, for routes
    nodeEnter
      .filter(ArchHierarchyHelper.isRoutes)
      .call(drawEllipseFn([ nodeWidth / 2, nodeHeight / 2 ], this.routesEllipseSize));

    // circle shape, for route
    nodeEnter
      .filter(ArchHierarchyHelper.isRoute)
      .call(drawCircleFn([ nodeWidth / 2, nodeHeight / 2 ]));

    // Rectangle shape, for no module and no routes(such as component, directive, service, pipe)
    nodeEnter
      .filter(isOthers)
      .call(drawRectangleFn(this.nodeSize));


    // draw bottom line text
    nodeEnter
      .filter(hasBottomLine)
      .call(drawBottomLineFn(this.nodeSize));

    // three gears, for service
    nodeEnter
      .filter(ArchHierarchyHelper.isService)
      .call(drawThreeGearsFn());

    // nodeEnter
    //   .filter( d => isComponent(d))
    //   .call(drawThreeGearsFn());

    // nodeEnter
    //   .filter( d => isDirective(d))
    //   .call(drawDirectiveBracketFn());

    // nodeEnter
    //   .filter( d => isComponent(d))
    //   .call(drawComponentSymbolFn());

    nodeEnter
      .call(d3_util.setStyles, rectStyle)
      .attr('fill', ArchHierarchyHelper.getNodeColor());
  }

  drawNodeExpandButtonFn() {
    const [ nodeWidth, nodeHeight ] = this.nodeSize;
    const actionRectAttrs = {
      x: nodeWidth,
      y: 0,
      width: nodeActionWidth,
      height: nodeHeight
    };

    return (nodeEnter: HierarchyPointNodeSelection) => {
      const nodeAction = nodeEnter
        // .append('path')
        // .attr('d', function(pointNode) {
        //   return `M${nodeWidth} 0 h${nodeActionWidth} v${nodeHeight} h-${nodeActionWidth}`;
        // })
        .append('rect')
        .attr('fill', ArchHierarchyHelper.getNodeColor(false))
        // .style('cursor', 'pointer')
        .call(d3_util.setAttrs, actionRectAttrs)
        .call(d3_util.setStyles, rectStyle)
        // .on('mouseover', function(a) {
        //   const host = d3.select(this);
        //   host.attr('width', nodeActionWidth * 4);
        // })
        // .on('mouseout', function() {
        //   const host = d3.select(this);
        //   host.attr('width', nodeActionWidth);
        // })
        ;

      return nodeAction;
    };
  }

  drawNodeContent(nodeEnter: HierarchyPointNodeSelection): ContentNodes {
    const nodeSize = this.nodeSize;
    return this._infoLevel === NodeInfoLevel.Basic
      ? drawText(nodeSize, nodeEnter) as any
      : drawDetailInfoContent(nodeSize, nodeEnter, false);
  }
}

function drawText(nodeSize: PairNumber, nodeEnter: HierarchyPointNodeSelection): HierarchyPointNodeSelection {
  return d3_svg.svgForeignDivText(nodeEnter, { text: (d) => d.data.name }, nodeSize, null, textDivStyle);
}

function drawDetailInfoContent(nodeSize: PairNumber, nodeEnter: HierarchyPointNodeSelection,
    basicInfo = true): ContentNodes {
  // config
  const contentMarginBottom = 4;
  const contentHeaderHeight = 17;
  const contentFooterHeight = 15;
  const mainContentMarginHorizon = 3;
  const textFn = (d: ArchHierarchyPointNode) => d.data.name;
  const rectAttrs = { stroke: 'none'};

  const [ nodeWidth, nodeHeight ] = nodeSize;
  let contentMainHeight = nodeHeight - contentFooterHeight - 2;

  // svg group
  const contentNode = d3_svg.svgGroup(nodeEnter, 'content', [0, 0]);

  // header
  let contentHeader: HierarchyPointNodeSelection;
  if (!basicInfo) {
    contentMainHeight -= contentHeaderHeight;
    contentHeader = d3_svg.svgGroup(contentNode.filter(ArchHierarchyHelper.isNotRoutesOrRouteNode), 'header', [0, 0]);

    d3_svg.svgRect(contentHeader, 'header', [1, 1], [nodeWidth - 2, contentHeaderHeight], rectAttrs);
    d3_svg.svgLine(contentHeader, null, [0, contentHeaderHeight + 2], [nodeWidth, contentHeaderHeight + 2]);
    d3_svg.svgTextFitContainer(contentHeader, textFn, null, [0, contentHeaderHeight - contentMarginBottom],
      nodeWidth, mainContentMarginHorizon , svgTextStyle);
  }

  const contentMain = d3_svg.svgGroup(contentNode, 'main', [0, contentHeaderHeight + 2]);
  if (basicInfo) {
    // text for NgModule, Component, Directive, Service
    d3_svg.svgTextFitContainer(contentMain.filter(ArchHierarchyHelper.isNotRoutesOrRouteNode), textFn, null, [0, 0], nodeWidth, mainContentMarginHorizon, svgTextStyle);
    // text for Routes and Route
    d3_svg.svgTextFitContainer(contentMain.filter(ArchHierarchyHelper.isRoutesOrRouteNode), textFn, null, [0, 6], nodeWidth, mainContentMarginHorizon, svgTextStyle);
  } else {
    d3_svg.svgForeignScrollableDiv(contentMain, { each: appendProviderContent}, [nodeWidth - 2, contentMainHeight], null, textMainStyle);
  }

  // footer
  const contentFooter = d3_svg.svgGroup(contentNode.filter(ArchHierarchyHelper.isNotRoutesOrRouteNode), 'footer', [0, nodeHeight - contentFooterHeight]);
  d3_svg.svgRect(contentFooter, 'footer', [1, -1], [nodeWidth - 2, contentFooterHeight], rectAttrs);
  d3_svg.svgLine(contentFooter, null, [0, 0], [nodeWidth, 0]);

  return { container: contentNode, header: contentHeader, main: contentMain, footer: contentFooter };
}

function drawModuleFn(nodeSize: PairNumber, folderIconLeft = true) {
  const [ nodeWidth, nodeHeight ] = nodeSize;
  const leftOffset = folderIconLeft ? 0 : 110;
  const angleLength = 3;
  const tabLength = 40;
  const tabHeight = 14;

  const firstPoint = leftOffset;
  const secondPoint = firstPoint + angleLength;
  const thirdPoint = secondPoint + tabLength - angleLength * 2;
  const fourthPoint = thirdPoint + angleLength;

  const moduleTab = `${firstPoint},0 ${secondPoint},-${tabHeight} ${thirdPoint},-${tabHeight} ${fourthPoint}, 0`;
  const commands = `0,0 ${moduleTab} ${nodeWidth},0 ${nodeWidth},${nodeHeight} 0,${nodeHeight} 0,0`;

  const drawExtendShape = _drawExtendRectangle(nodeWidth, nodeHeight);

  return (nodeEnter: HierarchyPointNodeSelection) => {
    drawExtendShape(nodeEnter, [[12, 6], [8, 3]]);

    nodeEnter
      .append('polygon')
      .attr('points', commands);
  };
}

function drawRectangleFn(nodeSize: PairNumber) {
  const [ nodeWidth, nodeHeight ] = nodeSize;
  const drawExtendShape = _drawExtendRectangle(nodeWidth, nodeHeight);

  return (nodeEnter: HierarchyPointNodeSelection) => {
    drawExtendShape(nodeEnter, [[12, 6], [8, 3]]);

    nodeEnter.append('rect')
      .classed('node-rectangle', true)
      .attr('width', nodeWidth)
      .attr('height', nodeHeight);
  };
}

function drawEllipseFn(position: PairNumber, ellipseSize: PairNumber) {
  const [ cx, cy ] = position;
  const [ nodeWidth, nodeHeight ] = ellipseSize;
  const rx = nodeWidth / 2;
  const ry = nodeHeight / 2;
  const drawExtend = _drawExtendEllipse(rx, ry);

  return (nodeEnter: HierarchyPointNodeSelection) => {
    drawExtend(nodeEnter, [ [cx + 4, cy + 6], [cx + 2, cy + 3]]);
    nodeEnter.append('ellipse')
      .classed('node-ellipse', true)
      .attr('cx', cx)
      .attr('cy', cy)
      .attr('rx', rx)
      .attr('ry', ry)
      ;
  };
}

function drawCircleFn(position: PairNumber) {
  const drawExtend = _drawExtendCircle(15);
  const [ cx, cy ] = position;

  return (nodeEnter: HierarchyPointNodeSelection) => {
    drawExtend(nodeEnter, [[cx + 2, cy + 4], [cx + 1, cy + 2]]);

    nodeEnter.append('circle')
      .classed('node-circle', true)
      .attr('cx', cx)
      .attr('cy', cy)
      .attr('r', 15)
      ;
  };
}

function drawBottomLineFn(nodeSize: PairNumber) {
  const [ nodeWidth, nodeHeight ] = nodeSize;
  return (nodeEnter: HierarchyPointNodeSelection) => {
    nodeEnter.append('text')
      .classed('node-bottom-line', true)
      .text(d => 'path: ' + d.data.bottomLine)
      .style('fill', 'black')
      .attr('font-size', 9)
      .attr('stroke-width', '0px')
      .attr('text-anchor', 'middle')
      .attr('x', nodeWidth / 2)
      .attr('y', nodeHeight + 14)
      ;
  };
}


function _drawExtendRectangle(width: number, height: number) {
  return (nodeEnter: HierarchyPointNodeSelection, xys: PairNumber[]) => {
    xys.forEach(([x, y]) => {
      nodeEnter.append('rect')
        .classed('node-extend-shape', true)
        .attr('x', x)
        .attr('y', y)
        .attr('visibility', ArchHierarchyHelper.getVisibility )
        .attr('width', width)
        .attr('height', height);
    });
  };
}

function _drawExtendEllipse(rx: number, ry: number) {
  return (nodeEnter: HierarchyPointNodeSelection, xys: PairNumber[]) => {
    xys.forEach(([x, y]) => {
      nodeEnter.append('ellipse')
        .classed('node-extend-shape', true)
        .attr('visibility', ArchHierarchyHelper.getVisibility )
        .attr('cx', x)
        .attr('cy', y)
        .attr('rx', rx)
        .attr('ry', ry)
        .attr('fill', '#f5a5a5');
    });
  };
}

function _drawExtendCircle(r: number) {
  return (nodeEnter: HierarchyPointNodeSelection, xys: PairNumber[]) => {
    xys.forEach(([x, y]) => {
      nodeEnter.append('circle')
        .classed('node-extend-shape', true)
        .attr('visibility', ArchHierarchyHelper.getVisibility )
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', r)
        .attr('fill', '#f5a5a5');
    });
  };
}

// function drawTwoGearFn() {
//   return (nodeEnter: HierarchyPointNodeSelection) => {
//     const gearGroup = nodeEnter
//      .append('g')
//      .call((d) => d3_util.translateTo(d, 100, -20));
//     gearGroup.append('path').attr('d', twoGearsPath);
//   };
// }

function drawThreeGearsFn(gearsOnLeft = true) {
  const left = gearsOnLeft ? 5 : 110;

  return (nodeEnter: HierarchyPointNodeSelection) => {
    if (nodeEnter.empty()) {
      return;
    }

    // gear group
    const groupAttrs: D3Transform = { translate: [left, -17], scale: 0.9 };
    const gearGroup = nodeEnter.append('g');
    d3_util.transformD3Element(gearGroup, groupAttrs);

    // gears
    const gearAttrs = { 'stroke': 'gray', 'stroke-width': '1' };
    const bottomAttrs = Object.assign({ opacity: '0.6'}, gearAttrs);
    const paths: D3PathAttr[] = [
      { name: 'LeftTopGear', path: firstGearOfTwo, attrs: gearAttrs, transform: { translate: [-10, 3], scale: 0.6}},
      { name: 'RightTopGear', path: firstGearOfTwo, attrs: gearAttrs, transform: { translate: [0, 0], scale: 0.8}},
      { name: 'BottomGear', path: secondGearOfTwo, attrs: bottomAttrs, transform: { translate: [0, 2], scale: 0.9}}
    ];
    d3_shape.combineGroupPaths(gearGroup, paths);
  };
}

function appendProviderContent(node: ArchHierarchyPointNode) {
  const host = d3.select(this);
  const element = host.node();

  const ponents = ArchHierarchy.getProviderNodes(node);
  // console.log(ponents);
  // const ponents = [ { name: 'test'}];
  if (ponents) {
    const items = ponents.map(createProviderDiv);
    items.forEach(item => element.appendChild(item));
  }

}

function createProviderDiv(provider: ArchNgPonentInjectable) {
  const item = document.createElement('div');
  item.innerText = provider.name;
  item.addEventListener('click', function() {
    console.log('click....');
  });

  return item;
}
