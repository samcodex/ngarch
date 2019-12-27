import { ArchHierarchyPointNode, HierarchyPointNodeSelection, ArchHierarchyHelper } from './arch-hierarchy';
import { d3_util } from '@core/svg/d3.util';
import { PairNumber } from '@core/models/arch-data-format';
import { Orientation, NodeInfoLevel } from '@core/diagram/layout-options';
import { drawModuleFn, drawEllipseFn, drawCircleFn, drawRectangleFn, drawTopLineFn, drawBottomLineFn, drawThreeGearsFn, drawText, drawDetailInfoContent } from './arch-hierarchy-node-shape';

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
    nodeMargin: [ 120, 45 ]
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
    const hasTopLine = (dNode: ArchHierarchyPointNode) => !!dNode.data.topLine;

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


    // draw top line text
    nodeEnter
    .filter(hasTopLine)
    .call(drawTopLineFn(this.nodeSize, this.orientation));

    // draw bottom line text
    nodeEnter
      .filter(hasBottomLine)
      .call(drawBottomLineFn(this.nodeSize, this.orientation));

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

  drawNodeContent(nodeEnter: HierarchyPointNodeSelection, textOpacity?: object): ContentNodes {
    const nodeSize = this.nodeSize;
    return this._infoLevel === NodeInfoLevel.Basic
      ? drawText(nodeSize, nodeEnter, textOpacity) as any
      : drawDetailInfoContent(nodeSize, nodeEnter, false);
  }
}
