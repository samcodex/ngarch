import * as d3 from 'd3';

import { RectangleSize, Point, ElementBox, DiagramNodeOptions } from '../models/arch-data-format';
import { d3_util } from '@core/svg/d3.util';
import { d3Element } from '@core/svg/d3-def-types';
import { BoardOptions } from '../diagram/board.config';
import { ArchNgPonent } from '../arch-ngponent';
import { DiagramLink } from './diagram-link';
import { ArchRelationship, ConnectionType } from '../arch-relationship';
import { AnalysisElementType } from '../models/analysis-element';
import { NodeLayoutable } from './node-layout';
import { DiagramElement } from '../diagram/diagram-element';
import { ElementDrawable } from './diagram-linkable-definition';


/**
 * This class is drawable, which contains abstract draw method
 * Linkable, the elements are linked through DiagramLink[], use linked data structure
 */
export abstract class DiagramLinkableElement<T = any> extends DiagramElement<T> implements ElementDrawable {
  protected diagramLinks: DiagramLink[] = [];
  protected elementSizes: { content: RectangleSize, title: RectangleSize };

  protected fullSize: RectangleSize;      // BBox

  protected group: d3Element;
  protected position: Point = {x: 0, y: 0};

  x?: number;   // for d3 force
  y?: number;   // for d3 force
  nodeLayout = new NodeLayoutable();

  constructor(
    elementType: AnalysisElementType,
    archPonent: ArchNgPonent,
    initPosition: RectangleSize
  ) {
    super(elementType, archPonent);

    this.fullSize = initPosition;

    this.group = d3_util.createGroup();
  }

  abstract drawTo?(root: d3Element, host: d3Element, options: BoardOptions, elementOptions?: DiagramNodeOptions): d3Element;
  abstract draw?(hostGroup: d3Element): void;

  getChildrenOf(connectionType?: ConnectionType) {
    const filterByType = (link: DiagramLink) => !connectionType || link.connectionType === connectionType;

    return this.diagramLinks
      .filter(link => filterByType(link) && link.source === this)
      .map(link => link.target);
  }

  get width() {
    return this.fullSize.width;
  }

  get height() {
    return this.fullSize.height;
  }

  get links(): DiagramLink[] {
    return this.diagramLinks;
  }

  addLink(link: DiagramLink) {
    this.diagramLinks.push(link);
  }

  changePosition(x: number, y: number) {
    this.position.x = x;
    this.position.y = y;
  }

  moveLinks(x: number, y: number) {
    this.diagramLinks.forEach(link => {
      link.move();
    });
  }

  moveTo(x: number, y: number) {
    this.changePosition(x, y);

    this.group
      .attr('transform', `translate(${x}, ${y})`)
      .attr('xt', x)
      .attr('yt', y)
      .attr('x-off', 0)
      .attr('y-off', 0)
    ;

    this.resetFullSize();
  }

  getRelationship(): ArchRelationship {
    return this.archPonent.archRelationship;
  }

  getElementSizes(): { content: RectangleSize, title: RectangleSize } {
    return this.elementSizes;
  }

  getElementSize(): ElementBox {
    const {x, y} = this.position;
    const { width, height } = this.fullSize;

    return {
      x: x,
      y: y,
      w: width,
      h: height
    };
  }

  getPosition(): Point {
    return this.position;
  }

  getFullSize(): RectangleSize {
    return this.fullSize;
  }

  getGroup(): d3Element {
    return this.group;
  }

  getCenterPoint(): Point {
    const size = this.getElementSize();
    return {x: size.w / 2 + size.x, y: size.h / 2 + size.y};
  }

  resetFullSize() {
    this.fullSize = d3_util.getBoxDimension(this.group);
    this.fullSize.width = Math.round(this.fullSize.width);
    this.fullSize.height = Math.round(this.fullSize.height);
  }

  createDragGroupHandler(that: DiagramLinkableElement, bgColorDragging: string, bgColorEnd: string, callback) {
    return d3.drag()
    .subject(<any>this)
    .on('start', function () {
        const g = d3.select(this);
        g.attr('x-off', d3.event.x)
          .attr('y-off', d3.event.y);

        g.select('.back-shape')
          .attr('fill', bgColorDragging);
    })
    .on('drag', function() {
      const g = d3.select(this);
      const xOff = d3.event.x - parseInt(g.attr('x-off'), 10);
      const yOff = d3.event.y - parseInt(g.attr('y-off'), 10);
      const xt = parseInt(g.attr('xt'), 10) + xOff;
      const yt = parseInt(g.attr('yt'), 10) + yOff;

      g.attr('transform', 'translate(' + xt  + ',' + yt + ')')
        .attr('xt', xt)
        .attr('yt', yt)
        .attr('x-off', d3.event.x)
        .attr('y-off', d3.event.y);

      const {x, y} = that.getCenterPoint();

      that.moveLinks(x, y);

      callback.call(that, xt, yt);
    })
    .on('end', function() {
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
