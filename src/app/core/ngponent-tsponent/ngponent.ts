import { Deserializable } from '../serialization';
import { NgTemplateElement } from './ng-template';
import { NgPonentFeature, NgPonentType } from './ngponent-definition';
import { MetadataProperty, TsPonent } from './tsponent';
import { TsPonentType } from './tsponent-definition';

export class NgPonent implements Deserializable {
  public $clazz = 'NgPonent';

  public fileName: string;
  public name: string;

  public ponentType: NgPonentType;
  public ngPonentFeatures: NgPonentFeature[];
  public loadingGroups: string[];

  private tsPonent: TsPonent;
  private ngTemplateElements: Array<NgTemplateElement>;

  constructor() {}

  // constructor(tsPonent?: TsPonent, name?: string) {
  //   this.name = name;

  //   this.setTsPonent(tsPonent);
  // }

  // setTsPonent(tsPonent: TsPonent) {
  //   this.tsPonent = tsPonent;
  //   if (tsPonent) {
  //     tsPonent.ngPonent = this;

  //     const keys = Object.keys(NgDecoratorToPonentType);
  //     if (keys.indexOf(tsPonent.name) > -1) {
  //       this.ponentType = NgDecoratorToPonentType[tsPonent.name];
  //     }
  //   }
  // }

  setTsPonent(tsPonent: TsPonent) {
    this.tsPonent = tsPonent;
  }

  getTsPonent(): TsPonent {
    return this.tsPonent;
  }

  traverse(callback: Function) {
    const result = callback.call(null, this);
    if (result !== false) {
      this.tsPonent.traverse(callback);
    }
  }

  getMetadata(property: MetadataProperty, ponentType = TsPonentType.StringExpressionPonent): TsPonent {
    return this.tsPonent.getMetadata(property, ponentType);
  }

  getMetadataValue(property: MetadataProperty): string {
    return this.tsPonent.getMetadataValue(property);
  }

  getTemplateElements(): NgTemplateElement[] {
    return this.ngTemplateElements;
  }

  flatTemplateElements(): NgTemplateElement[] {
    const flatElements: NgTemplateElement[] = [];
    const collectElement = (element: NgTemplateElement) => {
      flatElements.push(element);
    };

    if (this.ngTemplateElements) {
      this.ngTemplateElements.forEach(element => element.traverse(collectElement));
    }

    return flatElements;
  }
}

export function createNgPonent(tsPonent: TsPonent, ponentType: NgPonentType): NgPonent {
  const ngPonent = new NgPonent();
  ngPonent.name = tsPonent.name;
  ngPonent.fileName = tsPonent.fileName;
  ngPonent.setTsPonent(tsPonent);
  ngPonent.ponentType = ponentType;

  return ngPonent;
}
