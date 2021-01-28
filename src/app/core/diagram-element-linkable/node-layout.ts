export interface NodeLayout {
  textWidth?: number;
  textHeight?: number;
  rectWidth?: number;
  rectHeight?: number;
  width?: number;
  height?: number;
  fx?: number;
  fy?: number;
}

export class NodeLayoutable {
  nodeLayout: NodeLayout = {};

  get textWidth(): number {
    return this.nodeLayout['textWidth'];
  }

  set textWidth(width: number) {
    this.nodeLayout.textWidth = width;
  }

  get textHeight(): number {
    return this.nodeLayout['textHeight'];
  }

  set textHeight(height: number) {
    this.nodeLayout.textHeight = height;
  }

  get rectWidth(): number {
    return this.nodeLayout['rectWidth'];
  }

  set rectWidth(width: number) {
    this.nodeLayout.rectWidth = width;
  }

  get rectHeight(): number {
    return this.nodeLayout['rectHeight'];
  }

  set rectHeight(height: number) {
    this.nodeLayout.rectHeight = height;
  }

  get width(): number {
    return this.nodeLayout['width'];
  }

  set width(width: number) {
    this.nodeLayout.width = width;
  }

  get height(): number {
    return this.nodeLayout['height'];
  }

  set height(height: number) {
    this.nodeLayout.height = height;
  }

  get fx(): number {
    return this.nodeLayout.fx;
  }

  set fx(x: number) {
    this.nodeLayout.fx = x;
  }

  get fy(): number {
    return this.nodeLayout.fy;
  }

  set fy(y: number) {
    this.nodeLayout.fy = y;
  }
}
