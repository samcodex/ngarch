import * as d3 from 'd3';
import { RectangleSize, d3Element, PairNumber } from './../svg/d3.util';
import { DiagramElement } from '../diagram/diagram-element';
import { BoxArea } from '../bm67/box-area';
import { BoardState, BoardOptions } from './board';

const defaultMargin = {top: 0, left: 0, right: 0, bottom: 6};

const xAxisInterval = 100;
const yAxisInterval = 90;

const boxSetting = {
  x : 0, y : 0,
  width : 0, height : 0,
  space : 40,
  minW : 10, minH : 10
  };

export class FixedBoard {
  private title: string;
  private margin: RectangleSize = defaultMargin;

  private boardSize: RectangleSize;
  private boardOptions: BoardOptions = {
    dropShadowId: '#drop-shadow'
  };

  private state: BoardState;
  private root: d3Element;
  private hostSvg: d3Element;
  private hostGroup: d3Element;

  private scales: [d3.ScaleIdentity, d3.ScaleIdentity];
  private axis: [d3.Axis<PairNumber>, d3.Axis<PairNumber>];

  private packing: any;
  private elements: DiagramElement[] = new Array<DiagramElement>();

  constructor(title: string, host: d3Element) {
    this.title = title;
    this.state = BoardState.Initializing;

    this.root = host;
    this.hostSvg = host.append('svg').attr('class', 'board');
    this.hostGroup = this.hostSvg.append('g');

    // Define the div for the tooltip
    const div = host.append('div')
      .attr('class', 'board_tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('text-align', 'center')
      .style('width', '60px')
      .style('height', '28px')
      .style('padding', '2px')
      .style('font', '12px sans-serif')
      .style('background', 'lightsteelblue')
      .style('border', '0px')
      .style('border-radius', '8px')
      .style('pointer-events', 'none')
      ;

    this.defineDropShadow();
  }

  setMargin(margin: RectangleSize) {
    this.margin = margin;
  }

  appendGraph(graph: d3Element) {
    this.hostGroup.append(() => graph.node());
  }

  appendElement(element: DiagramElement) {
    this.elements.push(element);
    this.drawElement(element);
  }

  private drawElement(element: DiagramElement) {
    element.appendTo(this.root, this.hostSvg, this.boardOptions);

    this.placeElement(element);
  }

  private placeElement(element: DiagramElement): boolean {
    const box = element.getElementSize();
    const fittedBox = Object.assign({}, box);
    const isFitted = this.packing.fitBox(fittedBox);
    if (isFitted) {
      if (box.x !== fittedBox.x || box.x !== fittedBox.y) {
        element.moveTo(fittedBox.x, fittedBox.y);

        return true;
      }
    } else {

    }

    return false;
  }

  drawElements() {
    this.elements.forEach((element: DiagramElement) => {
      this.drawElement(element);
    });
  }

  changeSize(size: RectangleSize | PairNumber) {
    this.boardSize = Array.isArray(size)
      ? {width: size[0], height: size[1]}
      : size;

    boxSetting.width = this.boardSize.width;
    boxSetting.height = this.boardSize.height;

    this.packing = new BoxArea(boxSetting);

    if (this.state === BoardState.Drawn
        || this.state === BoardState.Drawing) {
      this.drawBoard();

      this.drawElements();
    }
  }

  drawBoard(): FixedBoard {
    this.state = BoardState.Drawing;

    const size = this.boardSize;
    const margin = this.margin;

    if (!size) {
      return;
    }

    const canvasSize = {
      width: (size.width - margin.left - margin.right),
      height: (size.height - margin.top - margin.bottom)
    };

    const xScale = d3.scaleIdentity().domain([0, canvasSize.width]);
    const yScale = d3.scaleIdentity().domain([0, canvasSize.height]);

    this.hostSvg.attr('width', canvasSize.width).attr('height', canvasSize.height);

    this.hostGroup.attr('transform', `translate(${margin.left},${margin.top})`);

    const xGrid = this.hostGroup.selectAll('line.x')
      .data(d3.range(0, canvasSize.width, xAxisInterval));

    xGrid
      .attr('y2', canvasSize.height)
      .enter()
        .append('line')
        .attr('class', 'x')
        .attr('x1', xScale)
        .attr('x2', xScale)
        .attr('y1', 0)
        .attr('y2', canvasSize.height)
        .attr('stroke', '#777')
        .attr('stroke-dasharray', '1, 5');

    xGrid.exit().remove();

    // Draw Y-axis grid lines
    const yGrid = this.hostGroup.selectAll('line.y')
      .data(d3.range(0, canvasSize.height, yAxisInterval));

    yGrid
      .attr('x2', canvasSize.width)
      .enter()
        .append('line')
        .attr('class', 'y')
        .attr('x1', 0)
        .attr('x2', canvasSize.width)
        .attr('y1', yScale)
        .attr('y2', yScale)
        .attr('stroke', '#777')
        .attr('stroke-dasharray', '1, 5');

    yGrid.exit().remove();

    this.state = BoardState.Drawn;

    return this;
  }

  private defineDropShadow() {
    const defs = this.hostSvg.append('defs');
    const filter = defs.append('filter')
      .attr('id', 'drop-shadow')
      .attr('height', '130%');

    filter.append('feGaussianBlur')
      .attr('in', 'SourceAlpha')
      .attr('stdDeviation', 5)
      .attr('result', 'blur');

    filter.append('feOffset')
      .attr('in', 'blur')
      .attr('dx', 4)
      .attr('dy', 4)
      .attr('result', 'offsetBlur');

    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode')
      .attr('in', 'offsetBlur');
    feMerge.append('feMergeNode')
      .attr('in', 'SourceGraphic');
  }
}
