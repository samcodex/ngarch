import * as d3 from 'd3';
import { get } from 'lodash-es';

import { UiElementItem } from '@core/models/ui-element-item';
import { D3PathAttr, SvgElementOptions, D3GroupFullAttributes, SimpleMargin } from './d3-def-types';
import { d3Element } from '@core/svg/d3-def-types';
import { appendRightBracket, appendLeftBracket } from './svg-defs';
import { d3_util } from './d3.util';
import { PairNumber } from '@core/models/arch-data-format';
import { d3_svg } from './d3.svg';
import { ArchHierarchyPointLink } from './../../ng-app-viewer/layout/arch-tree-layout/arch-hierarchy';
import { ArchHierarchyPointNode } from './../../ng-app-viewer/layout/arch-tree-layout/arch-hierarchy';

const _setAttrs = d3_util.setAttrs;
const _setGroupAttrs = d3_util.setGroupAttrs;
const _transformD3Element = d3_util.transformD3Element;

// funtions
const _placeNodeFn = (halfOffset: PairNumber, nodeSize: PairNumber, offsetMinusWidth = true) => {
  const [ nodeWidth, nodeHeight ] = nodeSize;
  return function(pointNode: ArchHierarchyPointNode, offset: PairNumber = [0, 0]) {
    const host: d3Element = d3.select(this);
    let { x, y } = pointNode;
    const [ offsetX, offsetY ] = offset;
    x += ((offsetMinusWidth ? -nodeWidth : 0) + halfOffset[0]) + offsetX;
    y += halfOffset[1] + offsetY;

    d3_util.translateTo(host, x, y);
    return {x, y};
  };
};

function _clickCancel() {
  // we want to a distinguish single/double click
  // details http://bl.ocks.org/couchand/6394506
  const dispatcher = d3.dispatch('click', 'dblclick');
  function cc(selection) {
    const tolerance = 5;
    let down, last, wait = null, args;
    // euclidean distance
    function dist(a, b) {
      return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
    }
    selection.on('mousedown', function() {
      d3.event.stopPropagation();
      down = d3.mouse(document.body);
      last = +new Date();
      args = arguments;
    });
    selection.on('mouseup', function() {
      if (dist(down || [ 0, 0 ], d3.mouse(document.body)) > tolerance) {
        return;
      } else {
        if (wait) {
          window.clearTimeout(wait);
          wait = null;
          dispatcher.apply('dblclick', this, args);
        } else {
          wait = window.setTimeout((function() {
            return function() {
              dispatcher.apply('click', this, args);
              wait = null;
            };
          })(), 300);
        }
      }
    });
  }

  // Copies a variable number of methods from source to target.
  const d3rebind = function(target, source, ...rest) {
    const n = arguments.length;
    let i = 1, method;
    while (++i < n) {
      target[method = arguments[i]] = d3_rebind(target, source, source[method]);
    }
    return target;
  };

  // Method is assumed to be a standard D3 getter-setter:
  // If passed with no arguments, gets the value.
  // If passed with arguments, sets the value and returns the target.
  function d3_rebind(target, source, method) {
    return function() {
      const value = method.apply(source, arguments);
      return value === source ? target : value;
    };
  }
  return d3rebind(cc, dispatcher, 'on');
}

function _createNodeEvent<T = any>(selection: d3Element, dblclickCallback?: Function, clickCallback?: Function) {
  const eventHandler = _clickCancel();
  selection.call(eventHandler);

  if (clickCallback) {
    eventHandler.on('click', (diagramNode: T, index: number, eventOwner: any) => {
      clickCallback.call(null, diagramNode, index, eventOwner);
    });
  }

  if (dblclickCallback) {
    eventHandler.on('dblclick', (diagramNode: T, index: number, eventOwner: any) => {
      dblclickCallback.call(null, diagramNode, index, eventOwner);
    });
  }
}

const _tipRectAttrs = { width: 0, height: 20, x: 0, y: 60, stroke: 'none', rx: 3, ry: 3, fill: 'lightgray' };
const _tipTextAttrs = { 'font-size': '12px', x: _tipRectAttrs.x + 5, y: _tipRectAttrs.y + 14, stroke: 'none', fill: 'black' };
const charWidth = 8;
function _styleMouseOver(tipHost: d3Element, outStyles: object, overStyles: object,
    tips?: { tip?: string, rectOptions?: SvgElementOptions, textOptions?: SvgElementOptions},
    zoomFactorFn = null, affectedSelector?: string) {

  const setStylesForEffecter = (effecter: d3Element, styles: object) => {
    if (!affectedSelector) {
      effecter.call(d3_util.setStyles, styles);
    } else {
      effecter
        .select(affectedSelector)
        .call(d3_util.setStyles, styles);
    }
  };

  return (pointNode: d3Element) => {

    setStylesForEffecter(pointNode, outStyles);

    pointNode
      .on('mouseover', function(contentData) {
        const actionItem = d3.select(this);
        setStylesForEffecter(actionItem, overStyles);

        let tipText = null;
        if (tips) {
          tipText = tips.tip;
          if (!tipText && 'tip' in contentData) {
            tipText = contentData['tip'];
          }
        }

        if (tipText) {
          const len = tipText.length;

          const tipsRectOptions: SvgElementOptions = tips.rectOptions || {};
          let tipRectOpts = _assign(_tipRectAttrs, tipsRectOptions, 'size');
          tipRectOpts = _assign(tipRectOpts, tipsRectOptions, 'position');
          tipRectOpts.x += get(tipsRectOptions, 'margin.horizontal', 0);
          tipRectOpts.width = len * charWidth;

          let tipTextOpts = _assign(_tipTextAttrs, tips.textOptions, 'size');
          tipTextOpts = _assign(tipTextOpts, tips.textOptions, 'attributes');
          tipTextOpts.x = tipRectOpts.x + 5;
          tipTextOpts.y = tipRectOpts.y + 14;

          const textRect = tipHost.append('rect').classed('tool_tips', true).call(_setAttrs, tipRectOpts);
          const textTip = tipHost.append('text').classed('tool_tips', true).text(tipText).call(_setAttrs, tipTextOpts);
          const textSize = d3_util.getRectDimension(textTip);
          const textWidth = zoomFactorFn ? textSize.width / zoomFactorFn() : textSize.width;
          textRect.attr('width', textWidth + 11);
        }
      })
      .on('mouseout', function() {
        const actionItem = d3.select(this);
        setStylesForEffecter(actionItem, outStyles);
        tipHost.selectAll('rect.tool_tips').remove();
        tipHost.selectAll('text.tool_tips').remove();
      });
  };
}

const _defaultCircleIconOut = { fill: '#e4e4e4', stroke: 'gray', cursor: 'default'};
const _defaultCircleIconOver = { fill: '#f9f9f9', stroke: 'gray', cursor: 'pointer' };
const _defaultCircleIconLocation = { x: 20, y: -12 };
const _defaultCircleIconAttrs = { r: 8 };
const _defaultCircleLetterAttrs = { x: -3, y: 4, 'font-size': '10px' };

function _createCircleLetterIcon<T>(host: d3Element, letter: string,
    containerOptions: SvgElementOptions, contentOptions: SvgElementOptions,
    toolTip: {tip: string, rectOptions?: SvgElementOptions},
    clickCallback: Function, dblCallback: Function, zoomFactorFn?: Function) {
  const iconCircleOut = _assign(_defaultCircleIconOut, containerOptions, 'outStyles');
  const iconCircleOver = _assign(_defaultCircleIconOver, containerOptions, 'overStyles');
  const iconLocation = _assign(_defaultCircleIconLocation, containerOptions, 'position');
  const iconCircleAttrs = _assign(_defaultCircleIconAttrs, containerOptions, 'attributes');
  const iconLetterAttrs = _assign(_defaultCircleLetterAttrs, contentOptions, 'attributes');
  const isClickable = clickCallback || dblCallback;
  if (isClickable) {
    iconLetterAttrs.cursor = 'pointer';
    iconCircleOver.cursor = 'pointer';
  }

  const button = host.append('g');
  button
    .attr('transform', `translate(${iconLocation.x}, ${iconLocation.y})`)
    .call(_styleMouseOver(button, iconCircleOut, iconCircleOver, toolTip, zoomFactorFn, 'circle'))
    ;

  // icon circle
  button
    .append('circle')
    .call(_setAttrs, iconCircleAttrs);

  // icon letter
  button
    .append('text')
    .text(() => letter.substring(0, 1))
    .call(_setAttrs, iconLetterAttrs);

  if (isClickable) {
    _createNodeEvent<T>(button, dblCallback, clickCallback);
  }
}

function _assign(template: object, copied: object, property: string) {
  return Object.assign({}, template, copied && property ? copied[property] : {});
}

const _barPosition = { x: 0, y: 0 };

const _rectangleIconOut = {
  fill: '#46a5ff',
  stroke: '#888888',
  cursor: 'default'
};
const _rectangleIconOver = {
  fill: '#e4e4e4',
  stroke: '#ffffff',
  cursor: 'pointer'
};
const _rectangleIconSize = {
  width: 24,
  height: 24
};
const _rectangleIconRadius = 3;
const _rectangleIconMargin = {
  horizontal: 2,
  vertical: 2
};

const _rectangleLetterAttrs = { 'font-size': '14px', fill: 'red', stroke: 'red' };
function _createLettersActionBar<T>(host: d3Element, actions: UiElementItem[],
    barOptions: SvgElementOptions, rectOptions: SvgElementOptions, itemOptions: SvgElementOptions,
    eachCallback: Function, clickAction: Function, dblClickAction: Function,
    zoomFactorFn?: Function) {

  let actionBarOptions = _assign(_barPosition, barOptions, 'position');
  actionBarOptions = _assign(actionBarOptions, barOptions, 'size');
  actionBarOptions = _assign(actionBarOptions, barOptions, 'outStyles');
  const actionBarLeft = actionBarOptions.x;

  const iconSize = _assign(_rectangleIconSize, rectOptions, 'size');
  const iconOut = _assign(_rectangleIconOut, rectOptions, 'outStyles');
  const iconOver = _assign(_rectangleIconOver, rectOptions, 'overStyles');
  const iconMargin = _assign(_rectangleIconMargin, rectOptions, 'iconMargin');

  const iconRadius: number = rectOptions && rectOptions['attributes']
    ? rectOptions['attributes']['radius'] || _rectangleIconRadius : _rectangleIconRadius;
  const actionItemAttrs = {
    rx: iconRadius,
    ry: iconRadius,
    width: iconSize.width,
    height: iconSize.width
  };
  const actionBarAttrs = {
    fill: actionBarOptions.fill,
    rx: iconRadius,
    ry: iconRadius,
    x: actionBarLeft,
    y: actionBarOptions.y,
    width: actionBarOptions.width,
    height: actionItemAttrs.height + iconMargin.vertical * 2
  };
  const letterAttrs = _assign(_rectangleLetterAttrs, itemOptions, 'attributes');
  letterAttrs.cursor = 'pointer';

  host.append('rect')
    .classed('action_bar_rect', true)
    .call(_setAttrs, actionBarAttrs);

  const itemGroup = host.selectAll('g.action_item')
    .data(actions)
    .enter()
    .append('g')
    .classed('action_item', true);

  const tipsConfig: {
    rectOptions: SvgElementOptions
  } = {
    rectOptions: {
      margin: { horizontal: actionBarLeft },
      position: { y: actionBarOptions.y + 25}
    }
  };
  itemGroup
    .call(_styleMouseOver(itemGroup, iconOut, iconOver, tipsConfig, zoomFactorFn, 'rect.action_item_frame'))
    .each(function(action, index, actionItems) {
      const actionGroup = d3.select(this);

      if (eachCallback) {
        eachCallback(action, index, actionItems);
      }

      _createNodeEvent<T>(actionGroup, dblClickAction, clickAction);
    });

  const iconLeftFn = (index: number) =>
    actionBarLeft + index * (iconSize.width + 2 * iconMargin.horizontal) + iconMargin.horizontal;

  itemGroup
    .append('rect')
    .classed('action_item_frame', true)
    .each(function(action, index) {
      const actionHost = d3.select(this);
      const x = iconLeftFn(index);
      const y = actionBarOptions.y + iconMargin.vertical;
      actionHost.attr('x', x).attr('y', y);
    })
    .call(_setAttrs, actionItemAttrs);

  // action item icon, which is one letter icon or Angular Material icon
  itemGroup
    .each(function(action, index) {
      const icon = action.icon || action.name;
      const iconType = action.iconType || 'text';

      const actionHost = d3.select(this);
      const horizontalOffset = iconSize.width / 4;
      const verticalOffset = iconSize.height / 4 * 3;
      let yOffset = 0;
      let xOffset = 0;

      let d3Item: d3Element;
      if (iconType === 'material') {
        yOffset = -17;
        xOffset = -7;

        d3Item = actionHost.append('svg:foreignObject')
          .attr('width', 20)
          .attr('height', 20);
        d3Item.append('xhtml:body')
          .style('color', letterAttrs.fill)
          .html(() => `<i class="material-icons">${icon}</i>`);
      } else {
        // text
        const iconLength = icon.length;
        const iconIndex = iconLength - 1;
        xOffset = 1 - iconIndex * (iconLength === 2 ? 3 : 2 );
        yOffset = [0, -1, -3][iconIndex > 2 ? 2 : iconIndex];

        d3Item = actionHost.append('text').text(() => icon);

        let fontSize = (14 - (icon.length - 1) * 3 );
        fontSize = fontSize <= 7 ? 7 : fontSize;
        letterAttrs['font-size'] = fontSize + 'px';
      }

      const keys = Object.keys(letterAttrs);
      keys.forEach(key => {
        d3Item.attr(key, letterAttrs[key]);
      });

      const x = iconLeftFn(index) + horizontalOffset + xOffset;
      const y = actionBarOptions.y + iconMargin.vertical + verticalOffset + yOffset;
      d3Item.attr('x', x).attr('y', y);
    });

  // action with one letter icon
  // itemGroup
  //   .append('text')
  //   .text((action) => (action.icon || action.name).substring(0, 1))
  //   .each(function(action, index) {
  //     const actionHost = d3.select(this);
  //     const horizontalOffset = iconSize.width / 4;
  //     const verticalOffset = iconSize.height / 4 * 3;
  //     const x = actionBarLeft + index * (iconSize.width + 2 * iconMargin.horizontal) + iconMargin.horizontal + horizontalOffset;
  //     const y = actionBarOptions.y + iconMargin.vertical + verticalOffset;

  //     actionHost.attr('x', x).attr('y', y);
  //   })
  //   .call(_setAttrs, letterAttrs);
}


function _appendGroupPath(host: d3Element, d3Path: D3PathAttr): d3Element {
  const { path, attrs, transform } = d3Path;
  const child = host.append('g');
  child.append('path').attr('d', path).call(_setAttrs, attrs);

  _transformD3Element(child, transform);

  return child;
}

function _combineGroupPaths(host: d3Element, paths: D3PathAttr[]): d3Element[] {
  return paths.map(path => _appendGroupPath(host, path));
}

function _appendPairBracket(brackets: d3Element, leftAttrs: D3GroupFullAttributes, rightAttrs: D3GroupFullAttributes) {
  const leftWrapper = brackets.append('g');
  const rightWrapper = brackets.append('g');
  const rightBracket = appendRightBracket(rightWrapper);
  const leftBracket = appendLeftBracket(leftWrapper);

  _setGroupAttrs(leftWrapper, leftBracket.path, leftAttrs);
  _setGroupAttrs(rightWrapper, rightBracket.path, rightAttrs);

  return {
    left: { wrapper: leftWrapper, bracket: leftBracket },
    right: { wrapper: rightWrapper, bracket: rightBracket },
  };
}


// TODO, It is not finished yet.
function _drawDivText(host: d3Element, text: string, margin: SimpleMargin,
    textStyle: {}, hasRectangle: boolean = true, nodeSize?: PairNumber): d3Element {
  // const nodeWidth = nodeSize ? nodeSize[0] : null;
  const [ nodeWidth, nodeHeight ] = nodeSize;
  const rectNode = host.append('rect');
  const textNode = host.append('foreignObject');
  const textDiv = textNode.append('xhtml:div');

  if (nodeWidth) {
    textNode.attr('width', nodeWidth);
    textDiv.style('width', nodeWidth + 'px');
  }

  textDiv.text(text)
      .call(d3_util.setStyles, textStyle)
      .each(function(d, i) {
        const _textNode: d3Element = d3.select(this);
        const size = d3_util.getRectDimension(_textNode);

        // parent - foreignObject
        const element = _textNode.node() as Element;
        const parent = d3.select(element.parentNode as any);

        const divHeight = nodeHeight && size.height > nodeHeight ? size.height + 4 : nodeHeight;
        parent.attr('height', divHeight);
        _textNode.style('height', divHeight + 'px');
      });

  rectNode
      .classed('node-rectangle', true)
      .attr('width', nodeWidth)
      .attr('height', function(d, i) {
        const rectHost: d3Element = d3.select(this);
        const element = rectHost.node() as Element;
        const parent = d3.select(element.parentNode as any);
        const foreignObject = parent.select('foreignObject');
        const foreignHeight = parseInt(foreignObject.attr('height'), 10);
        const rectHeight = nodeHeight < foreignHeight ? foreignHeight : nodeHeight;

        return rectHeight;
      });

  return textNode;
}

// action config
const actionItemSize = 20;
const itemMarginHorizontal = 2;
const barExpandWidth = 10;
// node's action bar and action items
function _drawActionBar(hostGroup: d3Element<any, any>, barStartX: number, barY = -15, rightToLeft = true, hasCloseButton = false) {
  return (nodeEnter: d3Element, mapNodeToActions: Function, callback: Function, zoomFactorFn?: Function,
      barColorFn?: (pNode: d3.HierarchyPointNode<any>) => string,
      actionColorFn?: (pNode: d3.HierarchyPointNode<any>) => string): d3Element => {
    const nodeActionBar = nodeEnter
      .append('g')
      .classed('action_bar', true);

    nodeActionBar.each(function(pointNode: d3.HierarchyPointNode<any>, barIndex: number) {
      const host = d3.select(this);
      const actions = mapNodeToActions(pointNode);

      const clickAction = (action: any) => {
        callback(action);
      };

      if (actions && Array.isArray(actions) && actions.length) {
        const itemCount = actions.length;
        const barWidth = itemCount * (actionItemSize + 2 * itemMarginHorizontal)
          + (hasCloseButton ? barExpandWidth : 0);
        const barLeft = rightToLeft ? barStartX - barWidth : barStartX;

        const barOptions: SvgElementOptions = {
          position: { x: barLeft, y: barY },
          size: { width: barWidth }
        };
        if (barColorFn) {
          const barColor = barColorFn(pointNode);
          barOptions.outStyles = { fill: barColor };
        }

        const rectOptions: SvgElementOptions = { size: { width: actionItemSize, height: actionItemSize}};
        if (actionColorFn) {
          const actionColor = actionColorFn(pointNode);
          rectOptions.outStyles = { fill: actionColor };
        }

        const itemOptions: SvgElementOptions = null;
        const eachCallback = (action: d3.HierarchyPointNode<any>, index, actionItems) => {
          action.data = pointNode.data;
        };

        // action bar & action items
        _createLettersActionBar<d3.HierarchyPointNode<any>>(host, actions, barOptions, rectOptions, itemOptions,
          eachCallback, clickAction, clickAction, zoomFactorFn);

        if (hasCloseButton) {
          // action bar close button
          const closeCallback = () => {
            const barHosts = nodeEnter.nodes();
            const barHost = d3.select(barHosts[barIndex]);
            d3_util.toggleSelectorShowHide(barHost, '.action_bar', false);
          };

          const closeIconOptions: SvgElementOptions = {
            position: { x: barLeft + barWidth, y: barY }
          };

          const toolTips = { tip: 'Close' };
          _createCircleLetterIcon(host, 'X', closeIconOptions, null, toolTips,
            closeCallback, closeCallback, zoomFactorFn);
        }
      }
    });

    function mouseToggle() {
      const host = d3.select(this);
      d3_util.toggleSelectorShowHide(host, '.action_bar');
      d3_util.toggleShowHideInNewHost(host, '.node_tip_group', null, hostGroup);
    }

    nodeEnter
      .on('mouseover', mouseToggle)
      .on('mouseout', mouseToggle)
      ;

    d3_util.toggleShowHide(nodeActionBar, false);
    return nodeActionBar;
  };
}

const tipBlockSize: PairNumber = [ 150, 50 ];
const tipRectAttrs = { fill: '#dcdcdc' };
const tipRectStyles = { stroke: '#c0c0c0', 'stroke-width': '1', 'filter': 'url(#drop-shadow)' };
const tipContentAttrs = { };
const tipContentStyles = { color: '#fb1b1b', 'font-size': '11px', direction: 'none', 'margin-left': '5px', 'margin-top': '5px' };
function _drawNodeTip() {
  return (nodeEnter: d3Element) => {
    const nodeTip = nodeEnter
      .filter((pointNode) => !!pointNode.data.nodeInfo)
      .append('g')
      .classed('node_tip_group', true);

    nodeTip.each(function(pointNode: d3.HierarchyPointNode<any>, index: number) {
      const node = nodeEnter.nodes()[index];
      const host = d3.select(node);
      const owner = d3.select(this);
      const size = d3_util.getRectDimension(host);
      const { width, height } = size;
      const x = width + 5;
      const y = -40;
      const tipId = 'node_tip_' + index;

      const textFn = () => {
        return pointNode.data.nodeInfo;
      };

      owner.attr('id', tipId);
      d3_svg.svgRect(owner, 'tip_rect', [ x, y ], tipBlockSize, tipRectAttrs, tipRectStyles);
      const div = d3_svg.svgForeignScrollableDiv(owner, { html: textFn }, tipBlockSize, tipContentAttrs, tipContentStyles);
      // const div = d3_svg.svgText(owner, textFn, 'tip_text', tipBlockSize, tipContentAttrs, tipContentStyles);
      div.attr('x', x).attr('y', y);
    });

    d3_util.toggleShowHide(nodeTip, false);
    return nodeTip;
  };
}

function _drawLinkTip() {
  return (linkEnter: d3Element) => {
    const linkTip = linkEnter
      .filter((pointLink) => !!pointLink.target.data.upLinkInfo)
      .append('g')
      .classed('link_tip_group', true);

    linkTip.each(function(pointLink: ArchHierarchyPointLink, index: number) {
      const target = pointLink.target;
      const owner = d3.select(this);
      const x = 0;
      const y = 0;
      const tipId = 'link_tip_' + index;

      const textFn = () => {
        return target.data.upLinkInfo;
      };

      owner.attr('id', tipId);
      d3_svg.svgRect(owner, 'tip_rect', [ x, y ], tipBlockSize, tipRectAttrs, tipRectStyles);
      d3_svg.svgForeignScrollableDiv(owner, { html: textFn }, tipBlockSize, tipContentAttrs, tipContentStyles);
    });

    d3_util.toggleShowHide(linkTip, false);
    return linkTip;
  };
}

export namespace d3_shape {
  export const clickAndDblclick = _clickCancel;
  export const createNodeEvent = _createNodeEvent;
  export const styleMouseOver = _styleMouseOver;
  export const createCircleLetterIcon = _createCircleLetterIcon;
  export const createLettersActionBar = _createLettersActionBar;
  export const appendGroupPath = _appendGroupPath;
  export const combineGroupPaths = _combineGroupPaths;
  export const appendPairBracket = _appendPairBracket;
  export const drawActionBar = _drawActionBar;
  export const drawNodeTip = _drawNodeTip;
  export const drawLinkTip = _drawLinkTip;
  export const placeNodeFn = _placeNodeFn;
}
