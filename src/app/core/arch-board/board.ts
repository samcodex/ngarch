import { forOwn, forEach } from 'lodash';
import * as d3 from 'd3';

import { RectangleSize, d3Element, PairNumber, d3_util, Dimension } from './../svg/d3.util';
import { DiagramElement } from '../diagram/diagram-element';
import { BoxArea } from '../bm67/box-area';

export interface BoardOptions {
  dropShadowId: string;
}

const defaultMargin = {top: 0, left: 0, right: 0, bottom: 6};

const xAxisInterval = 100;
const yAxisInterval = 90;

const boxSetting = {
  space : 40,
  x : 0, y : 0,
  width : 0, height : 0,
  minW : 10, minH : 10
};

const toolTipAttrs = { 'class': 'board_tooltip' };
const toolTipStyles = {
  'opacity': 0,
  'position': 'absolute',
  'text-align': 'left',
  'width': '250px',
  'padding': '5px',
  'font': '11px sans-serif',
  'background': '#57a0ff',
  'border': '1px solid gray',
  'border-radius': '4px',
  'pointer-events': 'none',
};

export class Board {
  private title: string;
  private margin: RectangleSize = defaultMargin;

  private boardSize: Dimension = {width: 0, height: 0};
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

  public placement: PlacementStrategy = PlacementStrategy.ExpandBoard;

  constructor(host: d3Element, title: string = null) {
    this.title = title;
    this.root = host;
    this.hostSvg = host.append('svg').attr('class', 'board');
    this.hostGroup = this.hostSvg.append('g');

    this.initBoard();

    // Define the div for the tooltip
    const div = host.append('div');
    forOwn(toolTipAttrs, (value, key) => {div.attr(key, value); });
    forOwn(toolTipStyles, (value, key) => { div.style(key, value); });

    this.defineDropShadow();
  }

  private initBoard() {
    this.state = BoardState.Initializing;
    this.changeBoardSize(screen.width, screen.height);
  }

  setMargin(margin: RectangleSize) {
    this.margin = margin;
  }

  appendGraph(graph: d3Element) {
    this.hostGroup.append(() => graph.node());
  }

  clear() {
    this.elements.forEach(element => element.clear());
    this.elements.length = 0;

    this.initBoard();
    this.packing.reset();
  }

  /**
   * Append and draw the element
   * @param element
   */
  presentElement(element: DiagramElement) {
    this.elements.push(element);

    element.appendTo(this.root, this.hostSvg, this.boardOptions);

    this.placeElement(element);
  }

  appendElement(element: DiagramElement) {
    this.elements.push(element);
  }

  drawElements() {
    this.elements.forEach((element) => {
      element.appendTo(this.root, this.hostSvg, this.boardOptions);
    });

    if (this.placement === PlacementStrategy.RebuildBoard) {
      this.placeElementsWithRebuild();
    } else {
      this.placeElementsWithExpand();
    }
  }

  private placeElementsWithExpand() {

    this.elements.forEach((element) => {
      const elementSize = element.getFullSize();
      let isFitted = true;

      do {
        isFitted = this.placeElement(element);
        if (!isFitted) {
          const width = Math.round(this.boardSize.width + elementSize.width);
          const height = Math.round(this.boardSize.height + elementSize.height);

          this.expandBoardSize(width, height);
          this.drawBoard();
        }
      } while (!isFitted);
    });
  }

  private placeElementsWithRebuild() {
    let isFitted = true;
    let placingElement: DiagramElement;

    do {
      if (placingElement) {
        const elementSize = placingElement.getFullSize();
        const width = Math.round(this.boardSize.width + elementSize.width);
        const height = Math.round(this.boardSize.height + elementSize.height);

        this.changeBoardSize(width, height);
        this.drawBoard();

        placingElement = null;
      }

      forEach(this.elements, (element) => {
        isFitted = this.placeElement(element);
        if (!isFitted) {
          placingElement = element;
          return false;
        }
      });
    } while (!isFitted);
  }

  private placeElement(element: DiagramElement): boolean {
    const box = element.getElementSize();
    const fittedBox = Object.assign({}, box);
    const isFitted = this.packing.fitBox(fittedBox);

    if (isFitted) {
      if (box.x !== fittedBox.x || box.x !== fittedBox.y) {
        element.moveTo(fittedBox.x, fittedBox.y);
      }
    }

    return isFitted;
  }

  setSize(width: number, height: number) {
    if (this.state === BoardState.Drawn
        || this.state === BoardState.Drawing) {

      this.changeBoardSize(width, height);
      this.drawBoard();
      this.drawElements();
    }
  }

  private changeBoardSize(width: number, height: number) {
    const setting = Object.assign({}, boxSetting);

    setting.width = this.boardSize.width = width;
    setting.height = this.boardSize.height = height;

    this.packing = new BoxArea(setting);
  }

  private expandBoardSize(width: number, height: number) {
    this.boardSize.width = width;
    this.boardSize.height = height;

    this.packing.expand(width, height);
  }

  drawBoard(): Board {
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


export enum BoardState {
  Initializing = 'Initializing',
  Initialized = 'Initialized',
  Drawn = 'Drawn',
  Drawing = 'Drawing'
}

export enum PlacementStrategy {
  RebuildBoard = 'RebuildBoard',
  ExpandBoard = 'ExpandBoard'
}
