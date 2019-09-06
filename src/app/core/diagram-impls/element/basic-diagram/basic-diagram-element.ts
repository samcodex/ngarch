import * as d3 from 'd3';

import { BoardOptions } from '@core/diagram/board.config';
import { ArchNgPonent } from '@core/arch-ngponent';
import { DiagramLinkableElement } from '@core/diagram-element-linkable';
import { DiagramElementFeature } from '@core/diagram/diagram-definition';
import { ModuleStyleList, Padding } from '../../../diagram-element-linkable/diagram-linkable-definition';
import { DiagramItem, DiagramItemType, DiagramItemClasses } from '@core/diagram-element-linkable/diagram-item';
import { AnalysisElementType } from '@core/models/analysis-element';
import { RectangleSize } from '@core/models/arch-data-format';
import { d3_util } from '@core/svg/d3.util';
import { d3Element } from '@core/svg/d3-def-types';
import { ArchConfig } from '../diagram-element.config';

const keywordSymbols = / [-+] /;
const marginOfEmptyBlock = 6;

export class BasicDiagramElement extends DiagramLinkableElement<DiagramItem[]> {

  constructor(
    elementType: AnalysisElementType,
    archPonent: ArchNgPonent,
    position: RectangleSize = {left: 0, top: 0}
  ) {
    super(elementType, archPonent, position);
  }

  draw() {

  }

  drawTo(root: d3Element, host: d3Element, options: BoardOptions): d3Element {
    this.clear();

    const group = this.group;
    const {left, top} = this.fullSize;
    // const origin = {x: left, y: top};
    const origin = {x: 0, y: 0};
    const [elementColor, dragColor] = ArchConfig.ElementColors[this.elementType];

    // attach the component group to the board
    host.append(() => group.node());
    this.moveTo(origin.x, origin.y);

    // div.tooltip
    const divTip = root.select('div.board_tooltip');

    // component shape
    const shape = group
      .append('path')
      .attr('class', 'back-shape')
      .attr('fill', elementColor)
      .attr('stroke', '#595959');

    const inner = d3_util.createGroup();
    group.append(() => inner.node());
    inner.attr('transform', `translate(${Padding.left}, ${Padding.top})`);

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

      // setElementStyle(content);

      // tip, the style is toolTipStyles in board.ts
      content.each(function(item, i) {
        if (item.tip && item.tip !== '') {
          d3.select(this)
            .style('text-decoration', 'underline')
            .on('mouseover', function(d) {
              const text = d3.select(this);
              const itemType = text.attr('itemType');

              divTip.transition()
                  .duration(200)
                  .style('opacity', 1);

              divTip.html(item.tip)
                  .style('background', dragColor)
                  .style('left', (d3.event.offsetX) + 'px')
                  .style('top', (d3.event.offsetY) + 'px');
              })
            .on('mouseout', function(d) {
              divTip.transition()
                  .duration(500)
                  .style('opacity', 0);
            });
        }
      });
    }

    const dragHandler = this.createDragGroupHandler.call(group, this, dragColor, elementColor, (x1: number, y1: number) => {
      this.changePosition(x1, y1);
    });
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
    if (this.data && this.data.length > 0) {
      contentSize.width = diff >= 0 && diff <= 50 ? contentSize.width + 50 - diff : contentSize.width;
    } else {
      contentSize.height -= marginOfEmptyBlock;
    }
    this.elementSizes = {
      content: contentSize,
      title: titleSize
    };
    let shapePath;
    if (ModuleStyleList.indexOf(this.elementType) > -1) {
      shapePath = d3_util.buildModuleStylePath(origin, contentSize, titleSize, Padding);
    } else {
      shapePath = d3_util.buildClassStylePath(origin, contentSize, titleSize, Padding);
    }
    shape.attr('d', shapePath.toString());

    // shadow
    const dropShadowId = options.dropShadowId;
    if (dropShadowId) {
      group.style('filter', `url(#${dropShadowId})`);
    }

    this.resetFullSize();

    return group;
  }

}

function setElementClass(item: DiagramItem) {
  const itemClass = DiagramItemClasses[item.itemType];
  return 'content ' + itemClass;
}

function outputElementText(item: DiagramItem) {
  if (item.itemType === DiagramItemType.ElementItem) {
    return keywordSymbols.test(item.value) ? item.value : '   ' + item.value;
  } else {
    return item.value;
  }
}

function setElementColor(item: DiagramItem) {
  return (item.itemType === DiagramItemType.SectionName) ? 'gray' : 'black';
}

function setElementFontSize(item: DiagramItem) {
  return (item.itemType === DiagramItemType.SectionName) ? '11px' : '12px';
}

// function setElementPositionY(item: DiagramItem, i: number) {
//   const offset = item.itemType === DiagramItemType.SectionFlagLess ? 0 : 1 ;
//   return (i + offset) * 20 ;
// }



// const elementStyleFns = {
//   [ DiagramItemType.SectionFlagLess ] : setSessionFlagLessStyle
// };

// function setElementStyle(elementContent) {
//   elementContent.each(function(item: DiagramItem) {

//     if (item.itemType in elementStyleFns) {
//       const fn = elementStyleFns[item.itemType];
//       const element = d3.select(this);
//       fn.call(element, element);
//     }
//   });
// }

// function setSessionFlagLessStyle(item: d3.Selection<any, {}, null, undefined>) {
//   item.attr('x', '40px');
// }
