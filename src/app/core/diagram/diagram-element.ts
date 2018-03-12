import * as d3 from 'd3';

import { d3Element, RectangleSize, d3_util } from './../svg/d3.util';
import { BoardOptions } from '../arch-board/board';
import { DiagramElementType, DiagramElementFeature } from '../diagram/diagram-element-definition';

export abstract class DiagramElement {
  protected elementType: DiagramElementType;
  protected name: string;
  protected fullSize: RectangleSize;      // BBox
  elementFeatures: {[key in DiagramElementFeature]?: Function} = {};

  protected group: d3Element;
  public groupTranslate: {x, y} = {x: 0, y: 0};

  constructor(
    elementType: DiagramElementType,
    name: string,
    position: RectangleSize
  ) {
    this.elementType = elementType;
    this.name = name;
    this.fullSize = position;

    this.group = d3_util.createGroup();
  }

  abstract appendTo(root: d3Element, host: d3Element, options: BoardOptions): d3Element;

  moveTo(x: number, y: number) {
    this.group
      .attr('transform', `translate(${x}, ${y})`)
      .attr('xt', x)
      .attr('yt', y)
      .attr('x-off', 0)
      .attr('y-off', 0)
    ;
    this.groupTranslate = {x: x, y: y};

    this.resetFullSize();
  }

  getName() {
    return this.name;
  }

  getElementSize(): {x, y, w, h} {
    const {x, y} = this.groupTranslate;
    const { width, height } = this.fullSize;

    return {
      x: x,
      y: y,
      w: width,
      h: height
    };
  }

  getGTransform() {
    return this.groupTranslate;
  }

  getFullSize(): RectangleSize {
    return this.fullSize;
  }

  getGroup(): d3Element {
    return this.group;
  }

  resetFullSize() {
    this.fullSize = d3_util.getBoxDimension(this.group);
    this.fullSize.width = Math.round(this.fullSize.width);
    this.fullSize.height = Math.round(this.fullSize.height);
  }

  addFeature(feature: DiagramElementFeature, callback: Function) {
    if (callback && typeof callback === 'function') {
      this.elementFeatures[feature] = callback;
    }
  }

  createDragGroupHandler(that: DiagramElement, bgColorDragging: string, bgColorEnd: string, callback) {
    return d3.drag()
    .subject(<any>this)
    .on('start', function () {
        const g = d3.select(this);
        g.attr('x-off', d3.event.x)
          .attr('y-off', d3.event.y);

        g.select('.back-shape')
          .attr('fill', bgColorDragging);
    })
    .on('drag', function(){
        const g = d3.select(this);
        const xOff = d3.event.x - parseInt(g.attr('x-off'), 10);
        const yOff = d3.event.y - parseInt(g.attr('y-off'), 10);
        const xt = parseInt(g.attr('xt'), 10) + xOff;
        const yt = parseInt(g.attr('yt'), 10) + yOff;

        d3.select(this)
        .attr('transform', 'translate(' + xt  + ',' + yt + ')');
        callback.call(that, xt, yt);

        g.attr('xt', xt)
          .attr('yt', yt)
          .attr('x-off', d3.event.x)
          .attr('y-off', d3.event.y);
    })
    .on('end', function(){
      const g = d3.select(this);

      g.select('.back-shape')
        .attr('fill', bgColorEnd);

      that.resetFullSize();
    });
  }

  clear() {
    this.group.selectAll('*').remove();
  }
}
