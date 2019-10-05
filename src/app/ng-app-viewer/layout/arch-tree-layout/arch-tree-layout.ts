import * as d3 from 'd3';
import { cloneDeep } from 'lodash-es';

import { DiagramLayout } from '@core/diagram/diagram-layout';
import { DiagramElementFeature } from '@core/diagram/diagram-definition';
import { d3_util } from '@core/svg/d3.util';
import { d3_shape } from '@core/svg/d3.shape';
import { d3Element } from '@core/svg/d3-def-types';
import { getCallback, LayoutCallbackFlag } from '@core/models/meta-data';
import { LayoutOptions, Orientation, hasLayoutFeature, LayoutFeature, NodeInfoLevel } from '@core/diagram/layout-options';
import { PairNumber, RectangleSize } from '@core/models/arch-data-format';
import { PonentActionItem, PonentActionScope, getArchPonentActions } from '../../models/viewer-content-types';
import { DiagramTreeContext } from '@core/diagram-tree/diagram-tree-context';
import { DiagramTreeNode } from '@core/diagram-tree/diagram-tree-node';
import { AnalysisElementType } from '@core/models/analysis-element';
import { SvgZoomBoard } from '@core/diagram-impls/diagram-board';
import { ArchHierarchy, ArchHierarchyPointNode, ArchHierarchyPointLink, HierarchyPointNodeSelection, ArchHierarchyHelper, HierarchyPointLinkSelection } from './arch-hierarchy';
import { ArchHierarchyNodeDrawer, duration, linkStyle, linkCoverStyle } from './arch-hierarchy-node-drawer';

let foreignStyle = '';
  foreignStyle += ' .--foreign-scrollable--::-webkit-scrollbar-track { -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); background-color: #F5F5F5;}';
  foreignStyle += ' .--foreign-scrollable--::-webkit-scrollbar { width: .6em; background-color: #F5F5F5; }';
  foreignStyle += ' .--foreign-scrollable--::-webkit-scrollbar-thumb { background-color: #0ae; }';
/**
 * TreeLayout version 3, uses ArchTree & ArchNode
 */
export class ArchTreeLayout extends DiagramLayout {
  private rawData: DiagramTreeNode;
  private treeRoot: ArchHierarchyPointNode;
  private treeLayout: d3.TreeLayout<DiagramTreeNode>;

  private nodeDrawer: ArchHierarchyNodeDrawer;
  private layoutOptions: LayoutOptions;

  private treeContainer: d3Element;
  private finalSize: RectangleSize;

  constructor() {
    super();
  }

  drawLayout(context: DiagramTreeContext | DiagramTreeNode | DiagramTreeNode[], layoutOptions?: LayoutOptions) {
    this.init();

    const board = this.board;
    board.appendStyle(foreignStyle);
    let root: DiagramTreeNode;
    if (context instanceof DiagramTreeContext) {
      root = context.root;
    } else if (context instanceof DiagramTreeNode) {
      root = context;
    } else {
      throw('Error, tree context/node(s) is empty');
    }

    // initialize the properties
    this.initProperties(root, layoutOptions);
    // initialize the tree layout and hierarchy data
    this.initTreeLayout();

    ArchHierarchy.alignChildrenWithCollapseStatus(this.treeRoot);

    // Collapse after the second level
    // if (hasLayoutFeature(layoutOptions, LayoutFeature.CollapseAfterSecondLevel)) {
    //   if (this.treeRoot.children) {
    //     this.treeRoot.children.forEach(collapse);
    //   }
    // }

    this.doDrawLayout();
  }

  private doDrawLayout() {
    this.updateTreeData();
    this.drawComponentLinks();
    this.drawComponentNodes();
  }

  private init() {
    this.treeContainer = this.rootGroup.append('g').classed('tree_container', true);

    // <use xlink:href="#id" />
    // https://github.com/w3c/svgwg/issues/511, foreignObject would not be considered in <use> for the shadow tree
    // this.rootGroup.append('use').attr('id', 'last_use').attr('href', '#node_tip_0');
  }

  private initProperties(root: DiagramTreeNode, layoutOptions: LayoutOptions) {
    this.rawData = root;
    this.layoutOptions = layoutOptions || {};
    this.layoutOptions.orientation = layoutOptions.orientation || Orientation.TopToBottom;
    this.layoutOptions.infoLevel = layoutOptions.infoLevel || NodeInfoLevel.Basic;

    const { orientation, infoLevel } = this.layoutOptions;
    this.nodeDrawer = new ArchHierarchyNodeDrawer(orientation, infoLevel);
  }

  private initTreeLayout() {
    // 1. tree layout
    this.treeLayout = d3.tree<DiagramTreeNode>();
    this.treeLayout.nodeSize(this.nodeDrawer.treeNodeSize);

    // 2. hierarchy data
    const { callbacks } = this.layoutOptions;
    const callback: any = getCallback(callbacks, LayoutCallbackFlag.HierarchyChildrenAccessor);
    this.treeRoot = d3.hierarchy(this.rawData, callback) as d3.HierarchyPointNode<any>;
    this.treeRoot.sum( () => 1);

    // traverse all tree nodes
    // this.treeRoot.descendants().forEach( (dNode, index) => {
    // });
  }

  private updateTreeData() {
    // Assigns the x and y position for the nodes
    this.treeLayout(this.treeRoot);

    // re-assign the x and y base for Routes and Route
    breadthFirstForOrientation(this.nodeDrawer.orientation)(this.treeRoot as ArchHierarchyPointNode);
  }

  private drawComponentNodes() {
    // Compute the new tree layout.
    const [ nodeWidth, nodeHeight ] = this.nodeDrawer.nodeSize;
    const getNodePosition = this.nodeDrawer.getNodePosition.bind(this.nodeDrawer);
    const placeNode = function(pointNode: ArchHierarchyPointNode) {
      const host: d3Element = d3.select(this);
      const [ x, y ] = getNodePosition(pointNode, [ -nodeWidth / 2, 0]);

      d3_util.translateTo(host, x, y);
    };

    // TODO, this line is for collapsing when the node is clicked
    // because 'exit()' cannot correctly remove the unused data and DOM element
    // This line should be removed after fixing it
    this.treeContainer
      .selectAll('.node').remove();

    // Update the nodes...
    const nodes = this.treeRoot.descendants();
    const gNode = this.treeContainer
      .selectAll('.node')
      .data(nodes);

    // Enter any new nodes
    const nodeEnter = gNode
      .enter()
      .append('g')
      .classed('node', true)
      .each(placeNode);

    // attach event handler
    this.attachNodeClickHandler(nodeEnter);
    this.attachNodeMouseOverHandler(nodeEnter);

    // draw node shape
    this.nodeDrawer.drawNodeShape(nodeEnter);

    // expand indicator
    const expandableNodes = nodeEnter.filter( d => !ArchHierarchyHelper.isRoutes(d) && !ArchHierarchyHelper.isRoute(d));
    const nodeAction = this.nodeDrawer.drawNodeExpandButtonFn()(expandableNodes);

    // text
    this.nodeDrawer.drawNodeContent(nodeEnter);

    // merge
    const nodeUpdate = gNode.merge(nodeEnter);
    // this.attachNodeSideBarAction(nodeAction, nodeUpdate);

    // node action bar
    const ponentActions = getArchPonentActions();
    const mapNodeToActions = mapNodeToActionsFn(ponentActions);
    const barColorFn = ArchHierarchyHelper.getNodeColor(false);
    const actionColorFn = ArchHierarchyHelper.getNodeColor();
    const actionY = this.layoutOptions.infoLevel === NodeInfoLevel.Basic ? 35 : 80;
    d3_shape.drawActionBar(nodeWidth + 20, actionY)(nodeEnter, mapNodeToActions,
      this.onClickActionItem.bind(this), this.getZoomFactorFn(), barColorFn, actionColorFn);

    // node tip
    d3_shape.drawNodeTip()(nodeEnter);

    // Transition to the proper position for the node
    nodeUpdate.transition()
      .duration(duration)
      .each(placeNode);

    gNode.exit().remove();

    const finalSize = d3_util.getDimension(this.treeContainer);
    this.finalSize = finalSize;
  }

  private drawComponentLinks() {
    // Compute the new tree layout.
    const links = this.treeRoot.links();
    const getNodePosition = this.nodeDrawer.getNodePosition.bind(this.nodeDrawer);
    const orientation = this.nodeDrawer.orientation;
    const [ nodeWidth, nodeHeight ] = this.nodeDrawer.nodeSize;
    const [ marginWidth, marginHeight ] = this.nodeDrawer.nodeMargin;
    const halfNodeWidth = nodeWidth / 2;
    const halfNodeHeight = nodeHeight / 2;

    const calcPoints = function(treeLink: ArchHierarchyPointLink) {
      const halfMarginWidth = marginWidth / 3;
      const { source, target } = treeLink;
      const [ sourceX, sourceY ] = getNodePosition(source);
      const [ targetX, targetY ] = getNodePosition(target);
      // const polyline = [source.x, source.y, source.x, source.y + pointsOfPolyline100,
      //   target.x, source.y + pointsOfPolyline100, target.x, target.y
      // ];

      let startPoint: PairNumber, secondPoint: PairNumber, thirdPoint: PairNumber, endPoint: PairNumber;
      if (orientation === Orientation.LeftToRight) {
        const secondPointX = sourceX + halfNodeWidth + halfMarginWidth;
        const startPointY = sourceY + halfNodeHeight;
        const targetPointY = targetY + halfNodeHeight;

        startPoint = [ sourceX, startPointY ];
        secondPoint = [ secondPointX, startPointY ];
        thirdPoint = [ secondPointX, targetPointY ];
        endPoint = [ targetX, targetPointY ];
      } else {
        // orientation === Orientation.TopToBottom
        const halfMarginHeight = marginHeight / 2;
        const secondPointY = targetY - halfMarginHeight;

        startPoint = [ sourceX, sourceY];
        secondPoint = [ sourceX, secondPointY ];
        thirdPoint = [ targetX, secondPointY ];
        endPoint = [ targetX, targetY + 5 ];      // '5' extend the line for collapsing route node
      }

      const polyline = [ ...startPoint, ...secondPoint, ...thirdPoint, ...endPoint];
      const points = d3_util.strPoints(polyline);

      return points;
    };

    // const link = this.treeContainer
    //   .selectAll('polyline.link')
    //   .data(links) as d3.Selection<SVGPolylineElement, d3.HierarchyPointLink<DiagramTreeNode>, d3.BaseType, any>;

    // const linkEnter = link
    //   .enter()
    //   .append('polyline')
    //   .classed('link', true)
    //   .call(d3_util.setStyles, linkStyle)
    //   .attr('points', calcPoints);

    // const linkUpdate = linkEnter.merge(link);
    // linkUpdate.attr('points', calcPoints);

    // link.exit().remove();

    this.treeContainer
      .selectAll('.link_group').remove();

    const link = this.treeContainer
      .selectAll('g.link_group')
      .data(links) as d3.Selection<SVGPolylineElement, d3.HierarchyPointLink<DiagramTreeNode>, d3.BaseType, any>;

    const linkEnter = link
      .enter()
      .append('g')
      .classed('link_group', true);

    const linkLine = linkEnter
      .append('polyline')
      .classed('link', true)
      .call(d3_util.setStyles, linkStyle)
      .attr('points', calcPoints);

    const linkCover = linkEnter
      .append('polyline')
      .classed('link_cover', true)
      .call(d3_util.setStyles, linkCoverStyle)
      .attr('points', calcPoints);

    this.attachLinkMouseOverHandler(linkCover);

    d3_shape.drawLinkTip()(linkCover);
  }

  private attachNodeClickHandler(nodeEnter: HierarchyPointNodeSelection) {
    const dblFn = (diagramNode: ArchHierarchyPointNode) => {
      const element = diagramNode.data;
      if (element && 'getFeatureCallback' in element) {
        const callback = element.getFeatureCallback(DiagramElementFeature.DblClick);
        if (callback) {
          callback.call(null, element);
          // callback.call(null, element.getArchNgPonent());
        }
      }
    };
    const clickFn = (diagramNode: ArchHierarchyPointNode) => {
      this.rootGroup.selectAll('.node_tip_group_copied').remove();

      ArchHierarchy.toggleArchHierarchyNode(diagramNode);
      this.doDrawLayout();
    };

    d3_shape.createNodeEvent<ArchHierarchyPointNode>(nodeEnter, dblFn, clickFn);
  }

  private attachNodeMouseOverHandler(nodeEnter: HierarchyPointNodeSelection) {
    const rootGroup = this.rootGroup;

    function mouseToggle() {
      const host = d3.select(this);
      d3_util.toggleSelectorShowHide(host, '.action_bar');
      d3_util.toggleShowHideInNewHost(host, '.node_tip_group', null, rootGroup);
    }

    nodeEnter
      .on('mouseover', mouseToggle)
      .on('mouseout', mouseToggle)
      ;
  }

  private attachLinkMouseOverHandler(linkEnter: HierarchyPointLinkSelection) {
    const rootGroup = this.rootGroup;

    function mouseToggle() {
      const host = d3.select(this);
      const mouseLocation = d3.mouse(this);
      const [ x, y ] = mouseLocation;

      // x, y offset must be large than the width of link cover;
      d3_util.toggleShowHideInNewHost(host, '.link_tip_group', null, rootGroup, [ x + 16, y - 12]);
    }

    linkEnter
      .on('mouseover', mouseToggle)
      .on('mouseout', mouseToggle)
      ;
  }

  private attachNodeSideBarAction(nodeAction: HierarchyPointNodeSelection, actionParent: HierarchyPointNodeSelection) {
    const clickFn = function(actionItem: HierarchyPointNodeSelection, index: number) {
      const hostNodes = actionParent.nodes();
      const host = d3.select(hostNodes[index]);
      d3_util.toggleSelectorShowHide(host, '.action_bar');
    };

    d3_shape.createNodeEvent<ArchHierarchyPointNode>(nodeAction, clickFn, clickFn);
  }

  private onClickActionItem(action: PonentActionItem) {
    const actionData = action.data;
    // if (actionData instanceof DiagramLinkableContext) {
    //   actionData = actionData.rootElement as DiagramLinkableElement;
    // }

    if (actionData && 'getFeatureCallback' in actionData) {
      const callback = actionData.getFeatureCallback(DiagramElementFeature.ActionClick);
      if (callback) {
        callback.call(null, action);
      }
    }

    if (!!action.type && action.type === PonentActionScope.LayoutAction) {
      ArchHierarchy.alignChildrenWithCollapseStatus(this.treeRoot);
      this.doDrawLayout();
    }
  }

  private getZoomFactorFn(): () => number {
    const board = this.board as SvgZoomBoard;
    return () => board.zoomFactor;
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

// breadth-first order, (level-by-level)
// such that a given node is only visited if all nodes of lesser depth have already been visited,
// as well as all preceding nodes of the same depth
function breadthFirstForOrientation(orientation: Orientation) {
  const fn = orientation === Orientation.LeftToRight ? offsetTopToBottom : offsetTopToBottom;

  return (tree: ArchHierarchyPointNode) => {
    tree.each( (node: ArchHierarchyPointNode) => {
      const parent = node.parent;
      const archPonentType = node.data.getElementType();
      const parentPonentType = parent ? parent.data.getElementType() : null;

      let factor = 0;
      if (orientation === Orientation.LeftToRight) {
        if (archPonentType === AnalysisElementType.Routes) {
          factor = 0; // 40
        } else if (archPonentType === AnalysisElementType.Route) {
          factor = 0; // 20
        } else if (parentPonentType === AnalysisElementType.Route) {
          factor = 80;
        }
      } else {
        if (archPonentType === AnalysisElementType.Routes) {
          factor = 0; // 40
        } else if (archPonentType === AnalysisElementType.Route) {
          factor = 0; // 20
        } else if (parentPonentType === AnalysisElementType.Route) {
          factor = 50;
        }
      }

      fn(node, factor);
    });
  };

  function offsetTopToBottom(node: ArchHierarchyPointNode, factor: number) {
    node['oy'] = node.y;
    const parent = node.parent;
    const oy = parent && parent.hasOwnProperty('oy') ? parent['oy'] : 0;
    const offset = parent ? oy - parent.y : 0;
    node.y -= (offset + factor);
  }

  function offsetLeftToRight(node: ArchHierarchyPointNode, factor: number) {
    node['ox'] = node.x;
    const parent = node.parent;
    const ox = parent && parent.hasOwnProperty('ox') ? parent['ox'] : 0;
    const offset = parent ? ox - parent.x : 0;
    node.x -= (offset + factor);
  }
}

// Post-order, leaf first
// such that a given node is only visited after all of its descendants have already been visited
function postOrder() {
  return (tree: ArchHierarchyPointNode) => {
    tree.eachAfter( (node: ArchHierarchyPointNode) => {
    });
  };
}

function mapNodeToActionsFn(ponentActions: any) {
  return (pointNode: d3.HierarchyPointNode<any>) => {
    const type = ArchHierarchyHelper.getElementType(pointNode);
    const actions = cloneDeep(ponentActions[type]);

    if (actions) {
      return actions.filter(action => action.filterFn ? action.filterFn(pointNode) : true);
    } else {
      return null;
    }
  };
}
