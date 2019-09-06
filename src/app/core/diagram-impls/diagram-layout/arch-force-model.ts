import { DiagramLinkableElement, DiagramLink, hasDiagramLink } from '@core/diagram-element-linkable';
import { AnalysisElementType } from '@core/models/analysis-element';

export class ForceNode {
  name?: string;
  id: string;
  group: number;
  width?: number;
  height?: number;
  color?: any;
  x?: number;
  y?: number;
  raw: DiagramLinkableElement;

  constructor(raw: DiagramLinkableElement, group = 0) {
    this.raw = raw;
    this.id = raw.name;
    this.name = raw.name;
    this.group = group;
  }

  get elementType(): AnalysisElementType {
    return this.raw.getElementType();
  }
}

export interface ForceLink {
  source: string | ForceNode | any;
  target: string | ForceNode | any;
  value?: number;
}

export interface ForceNodesLinks {
  nodes: ForceNode[];
  links: ForceLink[];
}


export function convertToForceData(diagramElements: DiagramLinkableElement[]): ForceNodesLinks {
  const nodes: ForceNode[] = diagramElements.map(convertElementToNode);
  const elementLinks: DiagramLink[] = [];

  diagramElements.forEach(element => {
    // console.log(element);
    element.links.forEach(link => {
      // console.log(link);
      if (!elementLinks.find((eleLink) => eleLink === link)) {
      // if (!hasDiagramLink(elementLinks, link)) {
        elementLinks.push(link);
      }
    });
  });

  const links: ForceLink[] = elementLinks.map(convertToLinks);


  return { nodes, links };
}

function convertElementToNode(element: DiagramLinkableElement): ForceNode {
  const node: ForceNode = new ForceNode(element);

  return node;
}

function convertToLinks(diagramLink: DiagramLink): ForceLink {
  return diagramLink as ForceLink;
}
