import * as d3 from 'd3';

import { d3_util, d3Element, RectangleSize } from '../svg/d3.util';
import { DiagramElement } from './../diagram/diagram-element';
import { IDiagramItem } from './../diagram/diagram-item-interface';
import { DiagramItemType } from './../diagram/diagram-item-type';
import { BoardOptions } from './../arch-board/board';
import { DiagramElementType } from '../diagram/diagram-element-definition';
import { DiagramElementFeature } from '../diagram/diagram-element-definition';
import { ArchNgPonent } from '../arch-ngponent';

const padding: RectangleSize = { top: 20, left: 10, right: 10, bottom: 12};

const elementSetting: {[ key in DiagramElementType]: [string, string]} = {
  [DiagramElementType.Module]: ['#b6d6fc', '#7fb7fa'],
  [DiagramElementType.Component]: ['#ffffb8', '#ffff80'],
  [DiagramElementType.Service]: ['#ffe6e6', '#efd2d0'],
  [DiagramElementType.Model]: ['#ffe6e6', '#efd2d0'],
  [DiagramElementType.Other]: ['#F6F6E8', '#DADAD8']
};
const moduleStyleList: DiagramElementType[] = [DiagramElementType.Module, DiagramElementType.Component];

const keywordSymbols = / [-+] /;

export class DiagramElementDrawer extends DiagramElement {
  private data: IDiagramItem[];
  private archPonent: ArchNgPonent;
  private isBuilt = false;

  constructor(
    elementType: DiagramElementType,
    archPonent: ArchNgPonent,
    data: IDiagramItem[],
    position: RectangleSize = {left: 0, top: 0}
  ) {
    super(elementType, archPonent.name, position);

    this.archPonent = archPonent;
    this.data = data;
  }

  appendTo(root: d3Element, host: d3Element, options: BoardOptions): d3Element {
    this.clear();

    const group = this.group;
    const {left, top} = this.fullSize;
    const origin = {x: left, y: top};
    const bgColors = elementSetting[this.elementType];

    // attach the component group to the board
    host.append(() => group.node());
    this.moveTo(origin.x, origin.y);

    // div.tooltip
    const div = root.select('div.board_tooltip');

    // component shape
    const shape = group
      .append('path')
      .attr('class', 'back-shape')
      .attr('fill', bgColors[0])
      .attr('stroke', '#595959');

    const inner = d3_util.createGroup();
    group.append(() => inner.node());
    inner.attr('transform', `translate(${padding.left}, ${padding.top})`);

    // title
    const componentTitle = inner
      .append('text')
      .attr('fill', 'black')
      .attr('font-size', '14px')
      .attr('font-family', 'sans-serif')
      .text(this.name)
      ;


    // content
    if (this.data && this.data.length > 0) {
      const content = inner.selectAll('text.content')
        .data(this.data)
        .enter()
        .append('text')
        .attr('itemType', (d) => d.itemType)
        .attr('class', setElementClass)
        .style('white-space', 'pre')
        .attr('y', (d, i) => (i + 1) * 20)
        .attr('fill', setElementColor)
        .attr('font-size', setElementFontSize)
        .attr('font-family', 'sans-serif')
        .text(outputElementText)
        .attr('transform', `translate(0, 5)`)
        ;

      content.each(function(item, i){
        if (item.itemType === DiagramItemType.SessionName && item.tip && item.tip !== '') {
          d3.select(this)
            .on('mouseover', function(d) {
              const text = d3.select(this);
              const itemType = text.attr('itemType');

              div.transition()
                  .duration(200)
                  .style('opacity', 1);

              div	.html(item.tip)
                  .style('left', (d3.event.offsetX) + 'px')
                  .style('top', (d3.event.offsetY) + 'px');
              })
            .on('mouseout', function(d) {
              div.transition()
                  .duration(500)
                  .style('opacity', 0);
            });
        }
      });
    }

    const dragHandler = this.createDragGroupHandler.call(group, this, bgColors[1], bgColors[0], (x1, y1) =>
      this.groupTranslate = {x: x1, y: y1}
    );
    group.call(dragHandler);

    if (this.elementFeatures && DiagramElementFeature.DblClick in this.elementFeatures) {
      group.on('dblclick', () => {
        this.elementFeatures[DiagramElementFeature.DblClick].call(null, this.archPonent);
      });
    }

    // shape path
    // content.node().getBoundingClientRect();
    const contentSize = d3_util.getBoxDimension(inner);
    const titleSize = d3_util.getBoxDimension(componentTitle);
    const diff = contentSize.width - titleSize.width;
    contentSize.width = diff >= 0 && diff <= 50 ? contentSize.width + 50 - diff : contentSize.width;
    let shapePath;
    if (moduleStyleList.indexOf(this.elementType) > -1) {
      shapePath = d3_util.buildModuleStylePath(origin, contentSize, titleSize, padding);
    } else {
      shapePath = d3_util.buildClassStylePath(origin, contentSize, titleSize, padding);
    }
    shape.attr('d', shapePath.toString());

    // shadow
    const dropShadowId = options.dropShadowId;
    if (dropShadowId) {
      group.style('filter', `url(${dropShadowId})`);
    }

    this.resetFullSize();

    this.isBuilt = true;

    return group;
  }

}

const setElementClass = (item: IDiagramItem) =>
  item.itemType === DiagramItemType.SessionName
    ? 'content session-name'
    : 'content item-name';

function outputElementText(item: IDiagramItem) {
  if (item.itemType === DiagramItemType.ElementItem) {
    return keywordSymbols.test(item.value) ? item.value : '   ' + item.value;
  } else {
    return item.value;
  }
}

function setElementColor(item: IDiagramItem) {
  if (item.itemType === DiagramItemType.SessionName) {
    return 'gray';
  } else {
    return 'black';
  }
}

function setElementFontSize(item: IDiagramItem) {
  if (item.itemType === DiagramItemType.SessionName) {
    return '11px';
  } else {
    return '12px';
  }
}

