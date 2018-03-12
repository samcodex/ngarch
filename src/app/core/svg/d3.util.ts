import * as d3 from 'd3';

export type d3Element = d3.Selection<d3.BaseType, any, d3.BaseType, any>;

export type PairNumber = [number, number];

export interface Dimension {
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface RectangleSize {
  left?: number;
  top?: number;
  right?: number;
  bottom?: number;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
}

export namespace d3_util {
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

}

