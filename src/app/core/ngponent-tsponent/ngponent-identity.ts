import { NgPonent } from './ngponent';
import { MetadataProperty } from './tsponent';

export type NgPonentId = NgPonentIdentifier | string;

export interface INgPonentIdentifier {
  name: string;
}

export function instanceOfNgPonentIdentifier(object: any): object is INgPonentIdentifier {
    return 'name' in object;
}

export class NgPonentIdentifier {
  name?: string;
  filename?: string;
  ngModule?: string;
  selector?: string;

  alter: NgPonentId;
  upAlter: NgPonentId;

  constructor() {}

  static createPonentIdentityWithNgPonent(ngPonent: NgPonent): NgPonentIdentifier {
    const ponentIdentity = new NgPonentIdentifier();
    const { name, fileName } = ngPonent;
    ponentIdentity.name = name;
    ponentIdentity.filename = fileName;
    ponentIdentity.selector = ngPonent.getMetadataValue(MetadataProperty.Selector);

    return ponentIdentity;
  }

  static createPonentIdentify(data: any): NgPonentIdentifier {
    const ponentIdentity = new NgPonentIdentifier();
    const { name, selector, ngModule } = data;
    const filename = data.filename || data.fileName;

    ponentIdentity.name = name;
    ponentIdentity.filename = filename;
    ponentIdentity.selector = selector;
    ponentIdentity.ngModule = ngModule;

    return ponentIdentity;
  }

  static isTypePonentId(id: any): boolean {
    return id
      ? typeof id === 'string' || instanceOfNgPonentIdentifier(id)
      : false;
  }

  isEqual(id: NgPonentId): boolean {
    let equal = false;

    if (id instanceof NgPonentIdentifier) {
      const { name, filename, ngModule, selector } = id;
      equal = checkEqual(name, this.name, equal);
      equal = checkEqual(selector, this.selector, equal);
      equal = checkEqual(filename, this.filename, equal);
      equal = checkEqual(ngModule, this.ngModule, equal);

    } else {
      equal = this.name === id;
    }

    return equal;
  }
}

function checkEqual(val1: string, val2: string, defValue: boolean): boolean {
  if (!!val1 && !!val2) {
    return val1 === val2;
  }

  return defValue;
}
