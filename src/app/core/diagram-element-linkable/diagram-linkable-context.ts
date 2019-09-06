import { DiagramElementContext } from '../diagram/diagram-element';
import { DiagramLinkableElement } from '@core/diagram-element-linkable/diagram-linkable-element';
import { DiagramLink } from '@core/diagram-element-linkable/diagram-link';
import { AnalysisElementType } from '@core/models/analysis-element';

// use linked data structure
export class DiagramLinkableContext extends DiagramElementContext {
  name: string;
  rootElement: DiagramLinkableElement | string = null;
  rootType: AnalysisElementType = null;

  private _elements: DiagramLinkableElement[] = new Array<DiagramLinkableElement>();
  private _links: DiagramLink[] = [];

  constructor() {
    super(null);
  }

  get elements() {
    return this._elements;
  }

  get links() {
    return this._links;
  }

  appendElement(element: DiagramLinkableElement) {
    this._elements.push(element);
  }

  getElementType(): AnalysisElementType {
    return this.rootType;
  }

  buildLinks() {
    this._elements
      .filter( element => !!element)
      .forEach(element => {
        const relationship = element.getRelationship();

        if (relationship && relationship.hasDownConnection) {
          const connections = relationship.downConnections;

          connections.forEach(connection => {
            const endArchPonent = connection.endOfArchPonent;
            const endElement = this._elements.find(el => el.getName() === endArchPonent.name);

            if (endElement) {
              const found = this._links.find(lnk => lnk.hasExistingLink(element, endElement, connection));
              if (!found) {
                const link = new DiagramLink(element, endElement, connection);
                this._links.push(link);
              }
            }
          });
        }
      });
  }

  clear() {
    if (this.rootElement && this.rootElement instanceof DiagramLinkableElement) {
      this.rootElement.clear();
    }

    this._elements.forEach(element => element.clear());
    this._elements.length = 0;

    this._links.forEach(line => line.clear());
    this._links.length = 0;
  }
}
