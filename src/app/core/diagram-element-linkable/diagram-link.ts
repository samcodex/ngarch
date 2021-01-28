import { forEach, forOwn } from 'lodash-es';

import { d3_util } from '@core/svg/d3.util';
import { d3Element } from '@core/svg/d3-def-types';
import { DiagramLinkableElement } from '@core/diagram-element-linkable';
import { Point } from '@core/models/arch-data-format';
import { ModuleStyleList, Padding } from './diagram-linkable-definition';
import { LogicalConnection, RelationshipType, ConnectionType } from '@core/arch-relationship/relationship-definition';
import { LineEndShapeId } from '@core/svg/svg-defs';
import { ElementDrawable } from './diagram-linkable-definition';

const mapOfStrokeDotted: RelationshipType[] = [
  RelationshipType.Inheritance,
  RelationshipType.Realization,
  RelationshipType.Dependency
];

const mapOfLineEndShape: { [key in RelationshipType] : {start: LineEndShapeId, end: LineEndShapeId}} = {
  [RelationshipType.Association] : {start: null, end: LineEndShapeId.ArrowLine},
  [RelationshipType.Aggregation] : {start: LineEndShapeId.Rhombus, end: null},
  [RelationshipType.Composite] : {start: LineEndShapeId.Rhombus, end: null},
  [RelationshipType.Inheritance] : {start: null, end: LineEndShapeId.Triangle},
  [RelationshipType.Realization] : {start: null, end: LineEndShapeId.Triangle},
  [RelationshipType.Dependency] : {start: null, end: LineEndShapeId.ArrowLine},
  [RelationshipType.Link] : {start: null, end: null}
};

export class DiagramLink implements ElementDrawable {
  private element1: DiagramLinkableElement;
  private element2: DiagramLinkableElement;
  private connection: LogicalConnection;
  private link: any;

  constructor(element1: DiagramLinkableElement, element2: DiagramLinkableElement, connection: LogicalConnection) {
    this.element1 = element1;
    this.element2 = element2;
    this.connection = connection;

    this.element1.addLink(this);
    this.element2.addLink(this);
  }

  get source(): DiagramLinkableElement {
    return this.element1;
  }

  get target(): DiagramLinkableElement {
    return this.element2;
  }

  get connectionType(): ConnectionType {
    return this.connection.connectionType;
  }

  clear() {
    if (this.link) {
      this.link.remove();
    }
  }

  draw(hostGroup: d3Element) {
    this.link = hostGroup.append('polyline')
      .attr('stroke', 'black')
      .attr('fill', 'none')
      .attr('stroke-width', 1);

    this.drawLineStroke();
    this.drawLineEndPoint();

    this.move();
  }

  hasExistingLink(element1: DiagramLinkableElement, element2: DiagramLinkableElement, connection: LogicalConnection): boolean {
    return this.element1 === element1 && this.element2 === element2 && this.connection === connection;
  }

  private drawLineStroke() {
    if (mapOfStrokeDotted.includes(this.connection.connectionType.type)) {
      this.link.attr('stroke-dasharray', '10, 10');
    }
  }

  private drawLineEndPoint() {
    const type = this.connection.connectionType.type;
    const shapes = mapOfLineEndShape[type];

    forOwn(shapes, (shapeId, prop) => {
      if (shapeId) {
        this.link.attr('marker-' + prop, `url(#${shapeId})`);
      }
    });
  }

  move() {
    const el1Size = this.element1.getElementSize();
    const el2Size = this.element2.getElementSize();
    let points = '';

    if (!d3_util.isOverlap(el1Size, el2Size)) {
      const [point1, point2] = this.calculateLinePoints();
      points = point1.x + ',' + point1.y + ' ' + point2.x + ',' + point2.y;
    }
    this.link.attr('points', points);
  }

  private calculateLinePoints(): [Point, Point] {
    const points: [Point, Point] = [null, null];
    let element: DiagramLinkableElement;
    const point1 = this.element1.getCenterPoint();
    const point2 = this.element2.getCenterPoint();

    for (let i = 1; i <= 2; i++) {
      element = this['element' + i];
      const elementType = element.getElementType();
      const sizes = element.getElementSizes();
      const position = element.getElementSize();
      const origin = {x: position.x, y: position.y};

      let shapePoints: Point[];
      if (ModuleStyleList.indexOf(elementType) > -1) {
        shapePoints = d3_util.createModuleShapePoints(origin, sizes.content, sizes.title, Padding);
      } else {
        shapePoints = d3_util.createClassShapePoints(origin, sizes.content, sizes.title, Padding);
      }
      shapePoints.push(shapePoints[0]);

      let previousPoint: Point;
      forEach(shapePoints, (currentPoint) => {
        if (previousPoint) {
          const linePoint = d3_util.findLineIntersectPoint(point1, point2, previousPoint, currentPoint);

          if (linePoint) {
            points[i - 1] = linePoint;
            return false;
          }
        }
        previousPoint = currentPoint;
      });

    }

    return points;
  }
}

export function hasDiagramLink(links: DiagramLink[], searchLink: DiagramLink): boolean {
  const found = links.find(link => link.source === searchLink.source
    && link.target === searchLink.target);
  return !!found;
}
