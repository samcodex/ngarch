import { DiagramLayout } from '@core/diagram/diagram-layout';
import { DiagramLinkableElement } from '@core/diagram-element-linkable';
import { PlacementStrategy } from '@core/diagram/board.config';
import { ElementBox } from '@core/models/arch-data-format';
import { BoxArea } from '@core/bm67/box-area';
import { svg_defs } from '@core/svg/svg-defs';
import { DiagramLinkableContext } from '@core/diagram-element-linkable/diagram-linkable-context';

const boxSetting = {
  space : 40,
  x : 0, y : 0,
  width : 0, height : 0,
  minW : 10, minH : 10
};

// TODO, no used, no finished
export class StarBlockLayout extends DiagramLayout {

  private packing: any;

  public placement: PlacementStrategy = PlacementStrategy.ExpandBoard;
  private isFirstAtCenter = false;

  constructor() {
    super();
  }

  drawLayout(elementContext: DiagramLinkableContext) {
    console.log('star - block');

    const diagramElements: DiagramLinkableElement[] = elementContext.elements;

    const board = this.board;

    this.createPackingBox();
    this.createSvgDefs();

    diagramElements
      .filter(element => element)
      .forEach((element) => {
        element.drawTo(board.boardHost, board.rootGroup , board.boardOptions);
      });

    this.placeElementsWithExpand(diagramElements);
  }

  private placeElementsWithExpand(elements: DiagramLinkableElement[]) {
    const board = this.board;
    const boardSize = this.board.getBoardSize();

    elements.forEach((element, index) => {
      const elementSize = element.getFullSize();
      let isFitted = true;

      if (this.isFirstAtCenter && index === 0) {
        const box = {
          x: boardSize.width / 3 - elementSize.width / 2,
          y: boardSize.height / 3 - elementSize.height / 3,
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
            const width = Math.round(boardSize.width + elementSize.width);
            const height = Math.round(boardSize.height + elementSize.height);

            board.changeBoardSize(width, height);
            this.createPackingBox();
            board.drawBoard();
          }
        } while (!isFitted);
      }
    });
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

  private createPackingBox() {
    const setting = Object.assign({}, boxSetting);
    const boardSize = this.board.getBoardSize();

    setting.width = boardSize.width;
    setting.height = boardSize.height;

    this.packing = new BoxArea(setting);
  }

  private createSvgDefs() {
    const board = this.board;
    const defs = board.defs;

    svg_defs.defineDropShadow(defs);
    svg_defs.defineTriangleShape(defs);
    svg_defs.defineArrowShape(defs);
    svg_defs.defineRhombusShape(defs);
  }
}
