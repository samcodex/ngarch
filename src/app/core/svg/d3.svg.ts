import * as d3 from 'd3';

import { d3Element } from '@core/svg/d3-def-types';
import { d3_util } from './d3.util';
import { PairNumber, Point } from '@core/models/arch-data-format';

const _setAttrs = d3_util.setAttrs;
const _setStyles = d3_util.setStyles;

export namespace d3_svg {
  export const svgGroup = _svgGroup;
  export const svgRect = _svgRect;
  export const svgLine = _svgLine;
  export const svgTextFitContainer = _svgTextFitContainer;
  export const svgText = _svgText;
  export const svgElement = _svgElement;
  export const svgForeignDivText = _svgForeignDivText;
  export const svgForeignScrollableDiv = _svgForeignScrollableDiv;
  export const svgForeignExtendableDiv = _svgForeignExtendableDiv;
  export const getTransformation = _getTransformation;
  export const getTranslate = _getTranslate;
  export const draggable = _draggable;
  export const moveLineTarget = _moveLineTarget;
  export const moveLineSource = _moveLineSource;
  export const transition = _transition;
}

function _svgGroup(host: d3Element, classed: string, position: PairNumber): d3Element {
  const [x, y] = position;
  const group = host.append('g')
    .classed(classed, true)
    .call(d => d3_util.translateTo(d, x, y));

  return group;
}

function _svgRect(host: d3Element, classed: string, position: PairNumber,
    size: PairNumber, rectAttrs?: object, rectStyles?: object): d3Element {
  const [x, y] = position;
  const [ width, height ] = size;
  const attrs = Object.assign({}, { x , y}, { width, height }, rectAttrs);
  const styles = Object.assign({}, rectStyles);

  return _svgElement(host, 'rect', classed, attrs, styles);
}

function _svgLine(host: d3Element, classed: string, startPoint: PairNumber,
    endPoint: PairNumber, rectAttrs?: object, rectStyles?: object): d3Element {
  const [x1, y1] = startPoint;
  const [ x2, y2 ] = endPoint;
  const attrs = Object.assign({}, { x1 , y1}, { x2, y2 }, rectAttrs);
  const styles = Object.assign({}, rectStyles);

  return _svgElement(host, 'line', classed, attrs, styles);
}

function _svgText(host: d3Element, textFn: (d: any) => string, classed: string,
  position: PairNumber, textAttrs?: object, textStyles?: object): d3Element {

  const [x, y] = position;
  const attrs = Object.assign({}, { x , y}, textAttrs);
  const styles = Object.assign({}, textStyles);
  const d3Text = _svgElement(host, 'text', classed, attrs, styles);
  if (textFn) {
    d3Text.text(textFn);
  }

  return d3Text;
}

/**
 * put text inside a container, adjust text width to fit the container
 * fit and centralize the text to the container
 */
function _svgTextFitContainer(host: d3Element, textFn: (d: any) => string, classed: string,
    position: PairNumber, width: number, marginHorizon: number,
    textAttrs?: object, centerText = true, textStyles?: object): d3Element {

  const [ x ] = position;

  const adjustAttrs = { lengthAdjust: 'spacing', textLength: width - marginHorizon * 2};
  const attrs = { x: x + marginHorizon};
  if (centerText) {
    attrs.x += (width / 2 - 2);
    attrs['text-anchor'] = 'middle';
  }
  Object.assign(attrs, textAttrs);

  const d3Text = _svgText(host, textFn, classed, position, attrs, textStyles);
  d3Text.each(function(d) {
    const d3Item = d3.select(this);
    const d3Size = d3_util.getDimension(d3Item);
    const { width: d3Width } = d3Size;

    if (d3Width > adjustAttrs.textLength) {
      d3_util.changeFontSize(d3Item);

      d3Item.call(_setAttrs, adjustAttrs);
    }
  });

  return d3Text;
}

function _svgElement(host: d3Element, element: string,
    classed: string, attrs?: object, styles?: object): d3Element {

  return host.append(element)
    .classed(classed, true)
    .call(_setAttrs, attrs)
    .call(_setStyles, styles);
}

const divBreakStyle = {
  'overflow-wrap': 'break-word',
  'word-break': 'break-word',
  'user-select': 'none'
};
const divScrollStyle = {
  'overflow': 'auto',
  'direction': 'rtl',
  'position': 'absolute',
  'user-select': 'none'
};

export interface D3Callbacks {
  each?: (d: any) => void;
  html?: (d: any) => any;
  text?: (d: any) => string;
}

function _assignProperties(callbacks: D3Callbacks, textAttrs?: object, textStyles?: object) {
  const { each, html, text } = callbacks;
  return (node: d3Element) => {
    if (text) {
      node.text(text);
    }
    if (html) {
      node.html(html);
    }
    if (each) {
      node.each(each);
    }

    node
      .call(_setStyles, textStyles)
      .call(_setAttrs, textAttrs);
  };
}

function _svgForeignScrollableDiv(host: d3Element, callbacks: D3Callbacks,
    size: PairNumber, textAttrs?: object, textStyles?: object): d3Element {

  const classed = '--foreign-scrollable--';
  const [ width, height ] = size;
  const styles = Object.assign({}, divScrollStyle, textStyles);

  const foreign = host
    .append('foreignObject')
    .attr('width', width)
    .attr('height', height);

  const textDiv = foreign
    .append('xhtml:div')
    .classed(classed, true)
    .style('width', width + 'px')
    .style('height', height + 'px')
    .call(_assignProperties(callbacks, textAttrs, styles));

  return foreign;
}

/**
 * display text in foreignObject div, wrap the text
 */
function _svgForeignDivText(host: d3Element, callbacks: D3Callbacks, size: PairNumber,
    textAttrs?: object, textStyles?: object): d3Element {

  const [ width, height ] = size;
  const styles = Object.assign({}, divBreakStyle, textStyles);

  const foreign = host
    .append('foreignObject')
    .attr('width', width);

  const textDiv = foreign
    .append('xhtml:div')
    .style('width', width + 'px')
    .each(function(node, i) {
      const hostDiv: d3Element = d3.select(this);
      const eachSize = d3_util.getRectDimension(hostDiv);

      // parent - foreignObject
      const element = hostDiv.node() as Element;
      const parent = d3.select(element.parentNode as any);

      const divHeight = eachSize.height > height ? eachSize.height + 4 : height;
      parent.attr('height', divHeight);
      hostDiv.style('height', divHeight + 'px');

      const dNode = node.data;
      if (dNode.hasOwnProperty('isClickable') && !!dNode.isClickable) {
        hostDiv.style('cursor', 'pointer');
      }
    })
    .call(_assignProperties(callbacks, textAttrs, styles));

  return foreign;
}

// extend div to fit the content
function _svgForeignExtendableDiv(callbacks: D3Callbacks, size: PairNumber,
    textAttrs?: object, textStyles?: object) {

  const [ width, height ] = size;
  const styles = Object.assign({}, divBreakStyle, textStyles);

  return (host: d3Element) => {
    host
      .append('foreignObject')
      .attr('width', width)
      .append('xhtml:div')
      .each(function(d, i) {
        const hostDiv: d3Element = d3.select(this);
        const eachSize = d3_util.getRectDimension(hostDiv);

        // parent - foreignObject
        const element = hostDiv.node() as Element;
        const parent = d3.select(element.parentNode as any);

        const divOffset = textStyles.hasOwnProperty('padding') ? 8 : 0;
        const divHeight = eachSize.height > height ? eachSize.height + 4 : height;
        parent.attr('height', divHeight);
        hostDiv.style('height', (divHeight - divOffset) + 'px');
      })
      .call(_assignProperties(callbacks, textAttrs, styles));
  };
}

function _getTransformation(transform) {
  // Create a dummy g for calculation purposes only. This will never
  // be appended to the DOM and will be discarded once this function
  // returns.
  var g = document.createElementNS("http://www.w3.org/2000/svg", "g");

  // Set the transform attribute to the provided string value.
  g.setAttributeNS(null, "transform", transform);

  // consolidate the SVGTransformList containing all transformations
  // to a single SVGTransform of type SVG_TRANSFORM_MATRIX and get
  // its SVGMatrix.
  var matrix = g.transform.baseVal.consolidate().matrix;

  // Below calculations are taken and adapted from the private function
  // transform/decompose.js of D3's module d3-interpolate.
  var {a, b, c, d, e, f} = matrix;   // ES6, if this doesn't work, use below assignment
  // var a=matrix.a, b=matrix.b, c=matrix.c, d=matrix.d, e=matrix.e, f=matrix.f; // ES5
  var scaleX, scaleY, skewX;
  if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
  if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
  if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
  if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
  return {
    translateX: e,
    translateY: f,
    rotate: Math.atan2(b, a) * 180 / Math.PI,
    skewX: Math.atan(skewX) * 180 / Math.PI,
    scaleX: scaleX,
    scaleY: scaleY
  };
}

function _getTranslate(element: d3Element): Point {
  const transform = element.attr('transform');
  const t = _getTransformation(transform);

  return {x: t.translateX, y: t.translateY};
}

function _draggable(element: d3Element, callback?: Function) {
  const offset: Point = {x: 0, y: 0};
  const previous: Point = {x: 0, y: 0};
  function dragstarted() {
    if (!d3.event.active) {
      const host = d3.select(this);
      const position = _getTranslate(host);
      Object.assign(previous, position);
      offset.x = position.x - d3.event.x;
      offset.y = position.y - d3.event.y;
    }
  }

  function dragged() {
    const host = d3.select(this);
    const { x, y } = d3.event;
    const newX = x + offset.x;
    const newY = y + offset.y;
    d3_util.translateTo(host, newX, newY);

    if (callback) {
      callback({x: newX - previous.x, y: newY - previous.y });
      previous.x = newX;
      previous.y = newY;
    }
  }

  function dragended() {
    if (!d3.event.active) {
      offset.x = 0;
      offset.y = 0;
    }
  }

  element
    .call(
      d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
    );
}

function _moveLineTarget(movedLink: d3Element) {
  const lineTarget: Point = { x: parseFloat(movedLink.attr('x2')), y: parseFloat(movedLink.attr('y2'))};
  return (offset: Point) => {
    lineTarget.x += offset.x;
    lineTarget.y += offset.y;
    movedLink.attr('x2', lineTarget.x).attr('y2', lineTarget.y);
  };
}

function _moveLineSource(movedLink: d3Element) {
  const lineSource: Point = { x: parseFloat(movedLink.attr('x1')), y: parseFloat(movedLink.attr('y1'))};
  return (offset: Point) => {
    lineSource.x += offset.x;
    lineSource.y += offset.y;
    movedLink.attr('x1', lineSource.x).attr('y1', lineSource.y);
  };
}

function _transition(element: d3Element, duration = 500) {
  return {
    show: () => {
      element.transition().duration(duration).style('opacity', 1).attr('visibility', 'visible');
    },
    hide: () => {
      element.transition().duration(duration).style('opacity', 0).attr('visibility', 'hidden');
    }
  };
}
