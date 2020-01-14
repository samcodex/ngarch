import { d3_util } from '@core/svg/d3.util';
import * as d3 from 'd3';
import { isFunction } from 'lodash-es';

import { d3Element } from '@core/svg/d3-def-types';
import { svg_defs } from '@core/svg/svg-defs';
import { Board, ROOT_GROUP_Margin } from '@core/diagram/board';
import { BoardType } from '@core/diagram/board.config';
import { LayoutOptions, Orientation } from '@core/diagram/layout-options';

const xAxisInterval = 100;
const yAxisInterval = 100;


const toolTipAttrs = { 'class': 'board_tooltip' };
const toolTipStyles = {
  'opacity': 0,
  'position': 'absolute',
  'text-align': 'left',
  'width': '250px',
  'padding': '5px',
  'font': '11px sans-serif',
  'border': '1px solid gray',
  'border-radius': '4px',
  'pointer-events': 'none',
  'word-wrap': 'break-word'
};

/**
 * Interface: 1.New Board, 2.
 */
export class SvgZoomBoard extends Board {
  private scales: [d3.ScaleLinear<number, number>, d3.ScaleLinear<number, number>];
  private _zoomFactor = 1;

  constructor(host: d3Element) {
    super(BoardType.SVG, host);

    this.changeBoardSize();
  }

  get zoomFactor(): number {
    return this._zoomFactor;
  }

  clear() {
    this.elementContext.clear();
    this.clearContentGroup();
  }

  resetSize(width?: number, height?: number, clearAll = true, useMaxSize = false) {
    if (clearAll) {
      this.clear();
    }
    this.changeBoardSize(width, height, useMaxSize);
    this.drawBoard();
  }

  drawBoard() {
    this.initBoard();
    this.drawBoardCanvas();
  }

  changeBoardSize(width?: number, height?: number, useMaxSize = false) {
    this.changeBoardWidth(width, useMaxSize);
    this.changeBoardHeight(height, useMaxSize);
  }

  drawElements() {
  }

  resetBoardContext(layoutOptions: LayoutOptions) {
    const { orientation } = layoutOptions || { orientation: null };
    const { left, top } = ROOT_GROUP_Margin;
    const { width, height } = this.boardSize;
    let translateX = 0, translateY = 0;

    if (orientation === Orientation.LeftToRight) {
      translateX = left;
      translateY = height / 2;
    } else if (orientation === Orientation.TopToBottom) {
      translateX = width / 2;
      translateY = top;
    }

    this.rootGroup.selectAll('*').remove();

    // zoom
    const zooming = () => {
      const transform = d3.event.transform;
      this._zoomFactor = transform.k as number || 1;
      this.rootGroup.attr('transform', transform);
    };
    const zoom = d3.zoom().on('zoom', zooming);
    this.rootSvg
      .call(zoom)
      .call(zoom.transform, d3.zoomIdentity.translate(translateX, translateY).scale(0.8))
      ;

    // stop zoom's double click
    this.rootSvg.on('dblclick.zoom', null);
  }

  private changeSvgViewBox() {
    const { width, height } = this.boardSize;
    // this.boardHost
  }

  private changeBoardWidth(width?: number, useMaxSize = false) {
    const maxWidth = this.maxSize ? this.maxSize.width : null;
    if (width && width >= 0) {
      this.boardSize.width = width;
    } else if (this.boardSizer && isFunction(this.boardSizer.width) ) {
      this.boardSize.width = this.boardSizer.width.call(null);
    } else if (!!maxWidth && useMaxSize) {
      this.boardSize.width = maxWidth;
    } else {
      const size = d3_util.getRectDimension(this.host);
      this.boardSize.width = size.width;
    }
  }

  private changeBoardHeight(height?: number, useMaxSize = false) {
    const maxHeight = this.maxSize ? this.maxSize.height : null;
    if (height && height >= 0) {
      this.boardSize.height = height;
    } else if (this.boardSizer && isFunction(this.boardSizer.height) ) {
      this.boardSize.height = this.boardSizer.height.call(null);
    } else if (!!maxHeight && useMaxSize) {
      this.boardSize.height = maxHeight;
    } else {
      const size = d3_util.getRectDimension(this.host);
      this.boardSize.height = size.height;
    }
  }

  private drawBoardCanvas(): SvgZoomBoard {
    const { boardSize, margin } = this;

    if (!boardSize) {
      return;
    }

    if (this.xTickLine) {
      this.xTickLine.remove();
    }
    if (this.yTickLine) {
      this.yTickLine.remove();
    }

    const canvasWidth = boardSize.width - margin.left - margin.right;
    const canvasHeight = boardSize.height - margin.top - margin.bottom;
    const xTickValues = d3.range(0, canvasWidth, xAxisInterval);
    const yTickValues = d3.range(0, canvasHeight, yAxisInterval);

    // canvas size
    this.rootSvg.attr('width', canvasWidth + 'px').attr('height', canvasHeight + 'px');
    this.rootSvg.attr('viewBox', `0 0 ${canvasWidth} ${canvasHeight}`);

    // scale
    const xScale = d3.scaleLinear().domain([-1, canvasWidth + 1]).range([-1, canvasWidth + 1]);
    const yScale = d3.scaleLinear().domain([-1, canvasHeight + 1]).range([-1, canvasHeight + 1]);
    this.scales = [ xScale, yScale ];

    // xAxis & x-tick
    const xAxis = d3.axisBottom(xScale)
      .tickValues(xTickValues)
      .tickSize(canvasHeight)
      .tickPadding(8 - canvasHeight);

    this.xTickLine = this.rootSvg.append('g')
      .classed('xAxisTicks', true)
      .lower()
      .call(xAxis);
    this.xTickLine
      .attr('stroke', '#777')
      .attr('stroke-dasharray', '1, 5');
    this.xTickLine.selectAll('text').remove();

    // yAxis & y-tick
    const yAxis = d3.axisRight(yScale)
      .tickValues(yTickValues)
      .tickSize(canvasWidth)
      .tickPadding(8 - canvasWidth);

    this.yTickLine = this.rootSvg.append('g')
      .classed('yAxisTicks', true)
      .lower()
      .call(yAxis);
    this.yTickLine
      .attr('stroke', '#777')
      .attr('stroke-dasharray', '1, 5');
    this.yTickLine.selectAll('text').remove();

    return this;
  }

  private createSvgDefs() {
    svg_defs.defineDropShadow(this.defs);
    // svg_defs.defineTriangleShape(this.defs);
    // svg_defs.defineArrowShape(this.defs);
    // svg_defs.defineRhombusShape(this.defs);
  }

  private initBoard() {
    // Define the div for the tooltip
    // const div = host.append('div');
    // forOwn(toolTipAttrs, (value, key) => {div.attr(key, value); });
    // forOwn(toolTipStyles, (value, key) => { div.style(key, value); });

    this.createSvgDefs();
  }
}


// this.rootGroup.attr('transform', `translate(${margin.left},${margin.top})`);

    // const xGrid = this.rootGroup.selectAll('line.x')
    //   .data(d3.range(0, canvasWidth, xAxisInterval));

    // xGrid
    //   .attr('y2', canvasHeight)
    //   .enter()
    //     .append('line')
    //     .attr('class', 'x')
    //     .attr('x1', xScale)
    //     .attr('x2', xScale)
    //     .attr('y1', 0)
    //     .attr('y2', canvasHeight)
    //     .attr('stroke', '#777')
    //     .attr('stroke-dasharray', '1, 5');

    // xGrid.exit().remove();

    // // Draw Y-axis grid lines
    // const yGrid = this.rootGroup.selectAll('line.y')
    //   .data(d3.range(0, canvasHeight, yAxisInterval));

    // yGrid
    //   .attr('x2', canvasWidth)
    //   .enter()
    //     .append('line')
    //     .attr('class', 'y')
    //     .attr('x1', 0)
    //     .attr('x2', canvasWidth)
    //     .attr('y1', yScale)
    //     .attr('y2', yScale)
    //     .attr('stroke', '#777')
    //     .attr('stroke-dasharray', '1, 5');

    // yGrid.exit().remove();
