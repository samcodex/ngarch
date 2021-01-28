import { DiagramLinkableContext } from '../diagram-element-linkable/diagram-linkable-context';
import { RectangleSize, Dimension } from '@core/models/arch-data-format';
import { BoardState, BoardType, BoardOptions } from './board.config';
import { d3Element } from '@core/svg/d3-def-types';
import { LineEndShapeId } from '@core/svg/svg-defs';
import { LayoutOptions } from '@core/diagram/layout-options';

const defaultMargin = {top: 0, left: 0, right: 0, bottom: 0};
export const ROOT_GROUP_Margin = { left: 100, top: 60};

/**
 * Running Structure: from low level to top
 * DiagramOrganizer -> Board -> Layout -> ArchPonents & DiagramElementBuilder -> DiagramElement -> displaying
 *
 * Code(static) structure:
 * DiagramOrganizer contains: Board & Layout & DiagramElementBuilder
 * Layout uses ArchPonents, or DiagramElementBuilder use ArchPonents to generate DiagramElement
 */
export abstract class Board {

  public isFirstAtCenter = false;
  public boardOptions: BoardOptions = {
    dropShadowId: LineEndShapeId.DropShadow
  };

  protected state: BoardState;
  protected host: d3Element;
  public rootSvg: d3Element;
  public rootGroup: d3Element;
  public defs: d3Element;
  public styles: d3Element;
  public maxSize: { width: number, height: number};

  protected boardSize: Dimension = { width: 0, height: 0 };
  protected boardSizer: { width, height} = { width: null, height: null };

  protected xTickLine: d3Element;
  protected yTickLine: d3Element;

  protected margin: RectangleSize = defaultMargin;
  protected elementContext: DiagramLinkableContext = new DiagramLinkableContext();

  protected hostedElements: d3Element[];

  constructor(
    protected boardType: BoardType,
    host: d3Element,
  ) {
    this.host = host;
    this.rootSvg = this.host.append('svg').classed('board', true)
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink');
    this.defs = this.rootSvg.append('defs');
    this.styles = this.rootSvg.append('style');
    this.rootGroup = this.rootSvg.append('g')
      // .attr('transform', `translate(${ROOT_GROUP_Margin.left}, ${ROOT_GROUP_Margin.top}) scale(1)`)
      ;
  }

  abstract drawBoard(): void;

  abstract clear(): void;

  abstract drawElements(): void;

  abstract resetSize(width?: number, height?: number): void;
  abstract resetBoardContext(layoutOptions: LayoutOptions): void;

  abstract changeBoardSize(width?: number, height?: number): void;

  get boardHost(): d3Element {
    return this.host;
  }

  get boardRoot(): d3Element {
    return this.boardRoot;
  }

  get boardGroup(): d3Element {
    return this.rootGroup;
  }

  getBoardSize() {
    return this.boardSize;
  }

  getDiagramContext(): DiagramLinkableContext {
    return this.elementContext;
  }

  clearContentGroup() {
    if (this.rootGroup) {
      this.rootGroup.selectAll('*').remove();
    }
  }

  drawLines() {
    this.elementContext.buildLinks();

    this.elementContext.links.forEach(link => {
      link.draw(this.rootSvg);
    });
  }

  removeRootSvg() {
    this.rootSvg.remove();

    if (this.hostedElements) {
      this.hostedElements.forEach(element => {
        element.remove();
      });
    }
  }

  setMargin(margin: RectangleSize) {
    this.margin = margin;
  }

  setBoardSizer(width?: Function, height?: Function) {
    this.boardSizer.width = width;
    this.boardSizer.height = height;
  }

  appendStyle(style: string) {
    let html = this.styles.html();
    html += ' ' + style;
    this.setStyle(html);
  }

  setStyle(style: string) {
    this.styles.html(style);
  }
}
