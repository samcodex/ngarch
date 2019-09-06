export type PairNumber = [number, number];
export type NumberFunction = (...rest: any[]) => number;
export type PairFunction = [ NumberFunction, NumberFunction ];
export type PairNumberFunction = PairNumber | PairFunction;

export const getPairNumber = ( pair: PairNumberFunction ): PairNumber => {
  const [ first, second ] = pair;
  const firstNumber = first instanceof Function ? first() : first;
  const secondNumber = second instanceof Function ? second() : second;
  return [ firstNumber, secondNumber ];
};

export interface Range {
  from: number;
  to: number;
}

export interface Dimension {
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface ElementBox {
  x: number;
  y: number;
  w: number;
  h: number;
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

export class PositionBox {
  constructor(private box: ElementBox) {}
  get left(): number {return this.box.x; }
  get top(): number {return this.box.y; }
  get right(): number {return this.box.x + this.box.w; }
  get bottom(): number {return this.box.y + this.box.h; }
}

export interface DiagramNodeOptions {
  size?: PairNumberFunction;
  margin?: PairNumberFunction;
  position?: PairNumberFunction;
  others?: any;
}
