import * as d3 from 'd3';
import { forEach, forOwn } from 'lodash-es';

import { BoxArea } from '@core/bm67/box-area';
import { DiagramLinkableElement } from '@core/diagram-element-linkable';
import { ElementBox, PairNumber } from '@core/models/arch-data-format';
import { d3Element } from '@core/svg/d3-def-types';
import { svg_defs } from '@core/svg/svg-defs';
import { BoardState, PlacementStrategy } from '@core/diagram/board.config';
import { Board } from '@core/diagram/board';
import { BoardType } from '@core/diagram/board.config';
import { LayoutOptions } from '@core/diagram/layout-options';

const xAxisInterval = 100;
const yAxisInterval = 100;

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
  'border': '1px solid gray',
  'border-radius': '4px',
  'pointer-events': 'none',
  'word-wrap': 'break-word'
};

export class SvgBoard extends Board {
  private scales: [d3.ScaleIdentity, d3.ScaleIdentity];
  private axis: [d3.Axis<PairNumber>, d3.Axis<PairNumber>];

  private packing: any;

  public placement: PlacementStrategy = PlacementStrategy.ExpandBoard;

  constructor(host: d3Element) {
    super(BoardType.SVG, host);

    this.initBoard();

    // Define the div for the tooltip
    this.declareHostedAttribute();

    this.createSvgDefs();
  }

  private declareHostedAttribute() {
    const div = this.host.append('div');
    forOwn(toolTipAttrs, (value, key) => {div.attr(key, value); });
    forOwn(toolTipStyles, (value, key) => { div.style(key, value); });
    if (!this.hostedElements) {
      this.hostedElements = [];
    }
    this.hostedElements.push(div);
  }

  private initBoard() {
    this.state = BoardState.Initializing;
    const boardWidth = document.body.clientWidth;
    const boardHeight = document.body.clientHeight;

    this.changeBoardSize(boardWidth, boardHeight);
  }

  appendGraph(graph: d3Element) {
    this.rootGroup.append(() => graph.node());
  }

  clear() {
    this.elementContext.clear();

    this.initBoard();
    this.packing.reset();
  }

  drawElements() {
    const elements = this.elementContext.elements;
    elements
      .filter(element => element)
      .forEach((element) => {
        element.drawTo(this.host, this.rootSvg, this.boardOptions);
      });

    if (this.placement === PlacementStrategy.RebuildBoard) {
      this.placeElementsWithRebuild();
    } else {
      this.placeElementsWithExpand();
    }
  }

  resetSize(width?: number, height?: number) {}

  resetBoardContext(layoutOptions: LayoutOptions) {}

  private placeElementsWithExpand() {
    const elements = this.elementContext.elements;

    elements.forEach((element, index) => {
      const elementSize = element.getFullSize();
      let isFitted = true;

      if (this.isFirstAtCenter && index === 0) {
        const box = {
          x: this.boardSize.width / 3 - elementSize.width / 2,
          y: this.boardSize.height / 3 - elementSize.height / 3,
          w: elementSize.width,
          h: elementSize.height
        };
        if (box.x < boxSetting.space) {
          box.x = boxSetting.space;
        }
        if (box.y < boxSetting.space) {
          box.y = boxSetting.space;
        }

        this.packing.placeBox(box);
        element.moveTo(box.x, box.y);
      } else {
        do {
          isFitted = this.placeElement(element);
          if (!isFitted) {
            const width = Math.round(this.boardSize.width + elementSize.width);
            const height = Math.round(this.boardSize.height + elementSize.height);

            this.expandBoardSize(width, height);
            this.drawBoard();
          }
        } while (!isFitted);
      }
    });
  }

  private placeElementsWithRebuild() {
    let isFitted = true;
    let placingElement: DiagramLinkableElement = null;
    const elements = this.elementContext.elements;

    do {
      if (placingElement) {
        const elementSize = placingElement.getFullSize();
        const width = Math.round(this.boardSize.width + elementSize.width);
        const height = Math.round(this.boardSize.height + elementSize.height);

        this.changeBoardSize(width, height);
        this.drawBoard();

        placingElement = null;
      }

      forEach(elements, (element) => {
        isFitted = this.placeElement(element);
        if (!isFitted) {
          placingElement = element;
          return false;
        }
      });
    } while (!isFitted);
  }

  private placeElement(element: DiagramLinkableElement): boolean {
    const box: ElementBox = element.getElementSize();
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
    // if (this.state === BoardState.Drawn
    //     || this.state === BoardState.Drawing) {

      this.changeBoardSize(width, height);
      this.drawBoard();
      this.drawElements();
    // }
  }

  changeBoardSize(width?: number, height?: number) {
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

  drawBoard(): SvgBoard {
    this.state = BoardState.Drawing;

    const { boardSize, margin } = this;

    if (!boardSize) {
      return;
    }

    const canvasSize = {
      width: (boardSize.width - margin.left - margin.right),
      height: (boardSize.height - margin.top - margin.bottom)
    };

    const xScale = d3.scaleIdentity().domain([0, canvasSize.width]);
    const yScale = d3.scaleIdentity().domain([0, canvasSize.height]);
    this.scales = [xScale, yScale];

    this.rootSvg.attr('width', canvasSize.width).attr('height', canvasSize.height);

    this.rootGroup.attr('transform', `translate(${margin.left},${margin.top})`);

    const xGrid = this.rootGroup.selectAll('line.x')
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
    const yGrid = this.rootGroup.selectAll('line.y')
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

  private createSvgDefs() {
    svg_defs.defineDropShadow(this.defs);
    svg_defs.defineTriangleShape(this.defs);
    svg_defs.defineArrowShape(this.defs);
    svg_defs.defineRhombusShape(this.defs);
  }

}
