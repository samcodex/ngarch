import * as d3 from 'd3';
import { forOwn } from 'lodash-es';

import { RectangleSize, Point, ElementBox, PositionBox, PairNumber } from '../models/arch-data-format';
import { D3Transform, D3FullAttributes, D3GroupFullAttributes } from './d3-def-types';
import { d3Element } from '@core/svg/d3-def-types';

export namespace d3_util {
  export function calcDistance(point1: Point, point2: Point) {
    const x = point1.x - point2.x,
      y = point1.y - point2.y,
      l = Math.sqrt(x * x + y * y);

    return l;
  }

  export function getElementSize(host: HTMLElement) {
    return (selector?: string) => {
      const element = selector ? host.querySelector(selector) : host;
      return getRectDimension(d3.select(element));
    };
  }

  export function getElement(host: HTMLElement) {
    return (selector: string) => {
      return d3.select(host.querySelector(selector));
    };
  }

  export function getRectDimension(selector: d3.Selection<d3.BaseType, any, d3.BaseType, any>): RectangleSize {
    const node = selector.node();
    return (<Element>node).getBoundingClientRect();
  }

  export function getBoxDimension(selector: d3.Selection<d3.BaseType, any, d3.BaseType, any>): RectangleSize {
    const node = selector.node();
    const box = <RectangleSize>((<SVGGraphicsElement>node).getBBox());
    box.left = box.x;
    box.top = box.y;
    return box;
  }

  export function getDimension(selector: d3.Selection<d3.BaseType, any, d3.BaseType, any>): RectangleSize {
    const node = selector.node();
    // if (node instanceof SVGElement) {
    //   return (<SVGElement>node).getBBox();
    if (node instanceof SVGGraphicsElement) {
      return getBoxDimension(selector);
    } else {
      return getRectDimension(selector);
    }
  }

  export function createGroup(tag: string = 'g'): d3.Selection<d3.BaseType, any, d3.BaseType, any> {
    return d3.select(document.createElementNS(d3.namespaces.svg, tag));
  }

  export function createEqTriangle(sideLength: number, centerPosition: [number, number]):
    [[number, number], [number, number], [number, number]] {
      const pi = 3.141592653589793238462643383;
      const halfSide = sideLength / 2;
      const innerHypotenuse = halfSide * (1 / Math.cos(30 * pi / 180));
      const innerOpposite = halfSide * (1 / Math.tan(60 * pi / 180));
      const left: [number, number] = [centerPosition[0] - halfSide, centerPosition[1] + innerOpposite];
      const right: [number, number] = [centerPosition[0] + halfSide, centerPosition[1] + innerOpposite];
      const top: [number, number] = [centerPosition[0], centerPosition[1] - innerHypotenuse];

      return [top, left, right];
    }

  export function createModuleShapePoints(origin: Point, bodyDimension: RectangleSize,
      titleDimension: RectangleSize, padding: RectangleSize): Point[] {
    const firstPoint = origin;
    const secondPoint = {
      x: firstPoint.x + titleDimension.width + padding.left + padding.right,
      y: firstPoint.y + titleDimension.height + padding.top - 5
    };
    const rightBottom = {
      x: firstPoint.x + bodyDimension.width + padding.left + padding.right,
      y: firstPoint.y + bodyDimension.height + padding.top
    };

    const points: Point[] = [];
    points.push(firstPoint);
    points.push({x: secondPoint.x, y: firstPoint.y});
    points.push(secondPoint);
    points.push({x: rightBottom.x, y: secondPoint.y});
    points.push(rightBottom);
    points.push({x: firstPoint.x, y: rightBottom.y});

    return points;
  }

  export function createClassShapePoints(origin: Point, bodyDimension: RectangleSize,
      titleDimension: RectangleSize, padding: RectangleSize): Point[] {

    const firstPoint = origin;
    const rightBottom = {
      x: firstPoint.x + bodyDimension.width + padding.left + padding.right,
      y: firstPoint.y + bodyDimension.height + padding.top
    };

    const points: Point[] = [];
    points.push(firstPoint);
    points.push({x: rightBottom.x, y: firstPoint.y});
    points.push(rightBottom);
    points.push({x: firstPoint.x, y: rightBottom.y});

    return points;
  }

  export function buildPathByPoints(points: Point[]): d3.Path {
    const path = d3.path();
    const [first, ...rests] = points;
    path.moveTo(first.x, first.y);
    rests.forEach(rest => path.lineTo(rest.x, rest.y));
    path.closePath();
    return path;
  }

  export function buildModuleStylePath(origin: {x, y}, bodyDimension: RectangleSize,
      titleDimension: RectangleSize, padding: RectangleSize): d3.Path {
    // dimension
    const firstPoint = origin;
    const secondPoint = {
      x: firstPoint.x + titleDimension.width + padding.left + padding.right,
      y: firstPoint.y + titleDimension.height + padding.top - 5
    };
    const rightBottom = {
      x: firstPoint.x + bodyDimension.width + padding.left + padding.right,
      y: firstPoint.y + bodyDimension.height + padding.top
    };

    return buildTwoRectanglePaths(firstPoint, secondPoint, rightBottom);
  }

  export function buildClassStylePath(origin: {x, y}, bodyDimension: RectangleSize,
      titleDimension: RectangleSize, padding: RectangleSize): d3.Path {
    // dimension
    const firstPoint = origin;
    const rightBottom = {
      x: firstPoint.x + bodyDimension.width + padding.left + padding.right,
      y: firstPoint.y + bodyDimension.height + padding.top
    };
    const secondPoint = {
      x: rightBottom.x,
      y: firstPoint.y + titleDimension.height + padding.top - 5
    };

    return buildTwoRectanglePaths(firstPoint, secondPoint, rightBottom);
  }

  export function buildTwoRectanglePaths(firstPoint: Point, secondPoint: Point, thirdPoint: Point): d3.Path {
    const path = d3.path();

    path.moveTo(secondPoint.x, secondPoint.y);
    path.lineTo(firstPoint.x, secondPoint.y);
    path.lineTo(firstPoint.x, firstPoint.y);
    path.lineTo(secondPoint.x, firstPoint.y);
    if (secondPoint.x !== thirdPoint.x) {
      path.lineTo(secondPoint.x, secondPoint.y);
      path.lineTo(thirdPoint.x, secondPoint.y);
    }
    path.lineTo(thirdPoint.x, thirdPoint.y);
    path.lineTo(firstPoint.x, thirdPoint.y);
    path.lineTo(firstPoint.x, secondPoint.y);
    path.closePath();

    return path;
  }

  export function buildTwoBoxPolygon(firstPoint: Point, secondPoint: Point, thirdPoint: Point): d3.Path {
    const path = d3.path();
    path.moveTo(firstPoint.x, firstPoint.y);
    path.lineTo(secondPoint.x, firstPoint.y);
    path.lineTo(secondPoint.x, secondPoint.y);
    path.lineTo(thirdPoint.x, secondPoint.y);
    path.lineTo(thirdPoint.x, thirdPoint.y);
    path.lineTo(firstPoint.x, thirdPoint.y);
    path.closePath();

    return path;
  }

  export function findLineIntersectPoint(x1, y1, x2, y2, x3, y3, x4, y4): Point {
    const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

    // lines are parallel
    if (denominator === 0) {
        return null;
    }

    const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
    const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

    // is the intersection along the segments
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
      return null;
    }

    // seg1: ua >= 0 && ua <= 1,
    // seg2: ub >= 0 && ub <= 1
    return {
      x: x1 + ua * (x2 - x1),
      y: y1 + ua * (y2 - y1)
    };
  }

  /**
   * Check if two rectangles intersection, intersect
   * @param r1
   * @param r2
   */
  export function isRectIntersected(r1: RectangleSize, r2: RectangleSize): boolean {
    return !(r2.left > r1.right ||
           r2.right < r1.left ||
           r2.top > r1.bottom ||
           r2.bottom < r1.top);
  }

  export function isPointInside(box: ElementBox, point: Point): boolean {
    return point.x > box.x && point.x + 2 < (box.x + box.w )
      && point.y > box.y && point.y + 2 < (box.y + box.h );
  }

  export function isOverlay(box1: ElementBox, box2: ElementBox): boolean {
    const pos1 = new PositionBox(box1);
    const pos2 = new PositionBox(box2);

    const noOverlay = pos1.left >= pos2.right || pos1.top >= pos2.bottom ||
      pos1.right <= pos2.left || pos1.bottom <= pos2.top;

    return !noOverlay;
  }

  export function setStyles(host: d3Element, styles: {}) {
    forOwn(styles, (value, key) => { host.style(key, value); });
  }

  export function translateTo(host: d3Element, x: number, y: number) {
    host.attr('transform', `translate(${x}, ${y})`);
  }

  export function strPoints(points: number[], prefix: string = '') {
    const [first, second] = points;
    let str = `${prefix}${first},${second}`;

    if (points.length > 2) {
      str += strPoints(points.slice(2), ' ');
    }

    return str;
  }

  export function wrapText(text: any, width: number) {
    text.each(function() {
      const that = d3.select(this),
        words = that.text().split(/\s+/).reverse(),

        lineHeight = 1.1, // ems
        x = that.attr('x'),
        y = that.attr('y');

      let word: string,
        lineNumber = 0,
        line = [],
        dy = parseFloat(that.attr('dy'));
      if (isNaN(dy)) {
        dy = 0;
      }

      let tspan = that.text(null).append('tspan').attr('x', x).attr('y', y).attr('dy', dy + 'em');

      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(' '));
        if ((<any>tspan.node()).getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(' '));
          line = [ word ];
          tspan = that.append('tspan').attr('x', x).attr('y', y).attr('dy', `${++lineNumber * lineHeight + dy}em`).text(word);
        }
      }
      that.attr('lineNumber', lineNumber + 1);
    });
  }

  export const setAttrs = _setAttrs;
  export const appendHTML = _appendHTML;
  export const appendSVG = _appendSVG;
  export const toggleShowHideInNewHost = _toggleShowHideInNewHost;
  export const toggleSelectorShowHide = _toggleSelectorShowHide;
  export const toggleShowHide = _toggleShowHide;
  export const transformD3Element = _transformD3Element;
  export const setAtrrsAndTrans = _setAtrrsAndTrans;
  export const setGroupAttrs = _setGroupAttrs;
  export const getForeignObjectHeight = _getForeignObjectHeight;
  export const changeUnited = _changeUnited;
  export const changeFontSize = _changeFontSize;
  export const findWithBreak = _findWithBreak;
}

function _setAttrs(host: d3Element, attrs: {}) {
  forOwn(attrs, (value, key) => { host.attr(key, value); });
}


// It’s quite likely we actually want to call this a link (shape) and put it in the d3-hierarchy module,
// since this shape is typically used to represent links in hierarchical visualizations.
// function diagonal(d: ArchHierarchyPointLink) {
//   return 'M' + d.source.y + ',' + d.source.x
//       + 'C' + (d.source.y + d.target.y) / 2 + ',' + d.source.x
//       + ' ' + (d.source.y + d.target.y) / 2 + ',' + d.target.x
//       + ' ' + d.target.y + ',' + d.target.x;
// }

// function linkHorizontal(d) {
//   return 'M' + d.source.x + ',' + d.source.y
//       + 'C' + d.source.x +  ',' + (d.source.y + d.target.y) / 2
//       + ' ' + d.target.x + ',' + (d.source.y + d.target.y) / 2
//       + ' ' + d.target.x + ',' + d.target.y;
// }

// function linkVertical(d) {
//   return 'M' + d.source.x + ',' + d.source.y
//       + 'C' + (d.source.x + d.target.x) / 2 + ',' + d.source.y
//       + ' ' + (d.source.x + d.target.x) / 2 + ',' + d.target.y
//       + ' ' + d.target.x + ',' + d.target.y;
// }

// https://gist.github.com/biovisualize/373c6216b5634327099a
function _appendHTML(selection: d3Element, HTMLString: string) {
  const dom = new DOMParser().parseFromString(HTMLString, 'text/html').body;
  const nodes = dom.childNodes;
  const d3Node: any = selection.node();

  for (let i = 0; i < nodes.length; i++) {
    d3Node.appendChild(document.importNode(nodes[i], true));
  }
}

// https://gist.github.com/biovisualize/373c6216b5634327099a
function _appendSVG(selection: d3Element, SVGString: string) {
  const domElement = new DOMParser().parseFromString('<svg xmlns="http://www.w3.org/2000/svg">' + SVGString + '</svg>', 'application/xml').documentElement;

  const children = domElement.children;
  const d3Node: any = selection.node();

  for (let i = 0; i < children.length; i++) {
    d3Node.appendChild(document.importNode(children.item(i), true));
  }
}

function _toggleShowHideInNewHost(host: d3Element, selector: string, isShow?: boolean, newHost?: d3Element, newLocation?: PairNumber) {
  const selection = host.select(selector);
  if (!selection.empty()) {
    let attrVisibility = selection.attr('_visibility');
    if ( [ 'visible', 'hidden' ].indexOf(attrVisibility) === -1) {
      attrVisibility = 'hidden';
      selection.attr('_visibility', attrVisibility);
    }

    const expectedShow = isShow === true || isShow === false
      ? isShow : attrVisibility !== 'visible';
    selection.attr('_visibility', expectedShow ? 'visible' : 'hidden');
    const copiedId = selection.attr('id') + '_copied';
    const copiedClass = selection.attr('class') + '_copied';

    newHost.selectAll('#' + copiedId).remove();

    if (expectedShow) {
      const copiedGroup = selection.clone(true);
      copiedGroup.style('visibility', 'visible');
      copiedGroup.attr('id', copiedId);     // The toggled element must define 'id'
      copiedGroup.attr('class', copiedClass);

      if (newLocation) {
        _transformD3Element(copiedGroup, { translate: newLocation });
      } else {
        const transform = host.attr('transform');
        if (transform) {
          copiedGroup.attr('transform', transform);
        }
      }

      const newHoseNode = newHost.node() as any;
      newHoseNode.appendChild(copiedGroup.node());
    }
  }
}

function _toggleSelectorShowHide(host: d3Element, selector: string, isShow?: boolean) {
  _toggleShowHide(host.select(selector), isShow);
}

function _toggleShowHide(selection: d3Element, isShow?: boolean) {
  if (!selection.empty()) {
    const expectedShow = isShow === true || isShow === false
      ? isShow : !_isVisibility(selection);

    selection.style('visibility', expectedShow ? 'visible' : 'hidden');
  }
}

function _isVisibility(selection: d3Element) {
  const visibility = selection.style('visibility');
  return visibility === 'visible';
}

function _transformD3Element(host: d3Element, attrs: D3Transform) {
  if (host && attrs) {
    const { translate, scale } = attrs;
    let transform = translate ? `translate(${translate[0]}, ${translate[1]})` : '';
    transform += scale ? ` scale(${scale})` : '';
    if (transform) {
      host.attr('transform', transform);
    }
  }
}

function _setAtrrsAndTrans(host: d3Element, attrsTrans: D3FullAttributes) {
  const { attributes, transform } = attrsTrans;
  _setAttrs(host, attributes);
  _transformD3Element(host, transform);
}

function _setGroupAttrs(host: d3Element, content: d3Element, d3GroupAttrs: D3GroupFullAttributes) {
  const { groupFullAttrs, contentFullAttrs } = d3GroupAttrs;
  if (host && groupFullAttrs) {
    _setAtrrsAndTrans(host, groupFullAttrs);
  }

  if (content && contentFullAttrs) {
    _setAtrrsAndTrans(content, contentFullAttrs);
  }
}

 function _getForeignObjectHeight(hostElement: any) {
  return () => {
    const givenElement = hostElement ? hostElement : this;
    const host: d3Element = d3.select(givenElement);
    const element = host.node() as Element;
    const parent = d3.select(element.parentNode as any);
    const foreignObject = parent.select('foreignObject');
    const foreignHeight = parseInt(foreignObject.attr('height'), 10);

    return foreignHeight;
  };
}

function _changeUnited(united: string, change: number, unit = 'px'): string {
  if (united.indexOf(unit) === -1) {
    return null;
  }
  const num = parseInt(united.replace(unit, ''), 10);
  return (num + change + unit);
}

function _changeFontSize(host: d3Element, change = -1) {
  const fontSize = host.attr('font-size');
  if (fontSize) {
    const newFontSize = d3_util.changeUnited(fontSize, change);
    host.attr('font-size', newFontSize);
  }
}

function _findWithBreak<T>(arr: T[], element: T, findFn: (t1: T, t2: T) => boolean): T {
  let result = null;
  arr.some(el => {
    const found = findFn(el, element);
    if (found) {
      result = found;
    }
    return !!found;
  });
  return result;
}
