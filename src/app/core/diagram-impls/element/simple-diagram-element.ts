
import { BoardOptions } from '@core/diagram/board.config';
import { ArchNgPonent } from '@core/arch-ngponent';
import { DiagramLinkableElement } from '@core/diagram-element-linkable';
import { DiagramItem } from '@core/diagram-element-linkable/diagram-item';
import { AnalysisElementType } from '@core/models/analysis-element';
import { RectangleSize } from '@core/models/arch-data-format';
import { d3Element } from '@core/svg/d3-def-types';

export class SimpleDiagramElement extends DiagramLinkableElement<DiagramItem[]> {
  name: string;

  constructor(
    elementType: AnalysisElementType,
    archPonent: ArchNgPonent,
    position: RectangleSize = { left: 0, top: 0 }
  ) {
    super(elementType, archPonent, position);
    this.name = archPonent ? archPonent.name : null;
  }

  draw() { }

  drawTo(root: d3Element, host: d3Element, options: BoardOptions): d3Element {
    return null;
  }
}
