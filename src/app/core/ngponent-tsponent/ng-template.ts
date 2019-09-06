import { NgPonentId, instanceOfNgPonentIdentifier } from './ngponent-identity';
import { NgPonent } from './ngponent';

export enum ArchElementType {
  IdentifiedElement = 'IdentifiedElement',      // the applications' element(component)
  NgIf = 'NgIf',
  NgFor = 'NgFor',
  RouterOutlet = 'RouterOutlet',
  ThirdParty = 'ThirdParty',                    // library, such as Material, etc.
  HtmlElement = 'HtmlElement',
  Angular = 'Angular'
}

export interface ElementProperty {
  elementType: ArchElementType;
  value: any;
  isComponent: boolean;
  selector: string;
  directiveName: string;
}

export class NgTemplateElement {
  $clazz = 'NgTemplateElement';

  host: NgPonent;
  root: NgTemplateElement;
  parent: NgTemplateElement;
  children: NgTemplateElement[];
  property: ElementProperty;

  ngPonentId: NgPonentId;

  constructor() {}

  static getNgPonentName(ngDependency: NgTemplateElement): string {
    let ponentName = null;
    const dependencyPonentId = ngDependency.ngPonentId;
    if (typeof dependencyPonentId === 'string') {
      ponentName = dependencyPonentId;
    } else if (dependencyPonentId && instanceOfNgPonentIdentifier(dependencyPonentId)) {
      ponentName = dependencyPonentId.name;
    }

    return ponentName;
  }

  traverse(callback: (element: NgTemplateElement) => void) {
    callback(this);

    if (this.children) {
      this.children.forEach((child) => {
        child.traverse(callback);
      });
    }
  }
}

