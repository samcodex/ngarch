import { first, forOwn } from 'lodash-es';

import { Deserializable } from '../serialization';
import { NgPonent } from './ngponent';
import { TsDataType } from './tsdatatype';
import { ExpressionPonentTypes, IDataType, TsPonentModifier, TsPonentType } from './tsponent-definition';


/**
 * Represents Typescript Component
 */
export class TsPonent implements Deserializable, IDataType {
  public $clazz = 'TsPonent';

  public fileName: string;
  public ponentType: TsPonentType;
  public name: string;
  public modifiers: Array<TsPonentModifier>;

  public _dataType?: TsDataType;
  public value?: any;
  public _rawValue?: any;
  public identifierFile?: string;

  public ngPonent?: NgPonent;            // optional

  public parent?: TsPonent | null;
  public members?: Array<TsPonent>;    // optional
  public previousTsPonent?: TsPonent;
  public nextTsPonent?: TsPonent;
  public options?: any;
  public __moduleFile__?: string;
  public __moduleName__?: string;

  constructor() {}

  get dataType(): string {
    if (this._dataType) {
      if (typeof this._dataType === 'string') {
        return this._dataType;
      } else {
        return this._dataType.originType;
      }
    } else {
      return null;
    }
  }

  getOption(key: string): any {
    if (this.options && key in this.options) {
      return this.options[key];
    }
    return undefined;
  }

  expressionPonentToString(): string {
    let expression = null;

    if (ExpressionPonentTypes.includes(this.ponentType)) {
      if (this.ponentType === TsPonentType.CallExpressionPonent) {
        let arg = '';
        if (this.members && this.members.length) {
          this.members.forEach(member => {
            arg = member.expressionPonentToString();
          });
        }

        expression = this.name + `(${arg})`;
      } else if (this.ponentType === TsPonentType.IdentifierExpressionPonent) {
        expression = this.value;

      } else if (this.ponentType === TsPonentType.StringExpressionPonent) {
        expression = this.value;

      } else if (this.ponentType === TsPonentType.ObjectExpressionPonent) {
        if (this.members && this.members.length) {
          expression = this.members.map(member => member.name + ': ' + member.expressionPonentToString()).join(', ');
        }
        expression = `{${expression}}`;

      } else if (this.ponentType === TsPonentType.ArrayExpressionPonent) {
        if (this.members && this.members.length) {
          expression = this.members.map(member => member.expressionPonentToString()).join(', ');
        }

      } else if (this.ponentType === TsPonentType.BooleanExpressionPonent) {
        expression = `${this.name}: ${this.value}`;
      }
    }

    return expression;
  }

  extractExpressionPonentDependencies(): string[] {
    const dependencies: string[] = [];

    if (ExpressionPonentTypes.includes(this.ponentType)) {
      if (this.ponentType === TsPonentType.CallExpressionPonent) {
        dependencies.push(first(this.name.split('.')));

        if (this.members && this.members.length) {
          this.members.forEach(member => {
            dependencies.push.apply(dependencies,
              member.extractExpressionPonentDependencies());
          });
        }

      } else if (this.ponentType === TsPonentType.IdentifierExpressionPonent) {
        dependencies.push(this.value);

      } else if (this.ponentType === TsPonentType.StringExpressionPonent) {
        dependencies.push(this.value);

      } else if (this.ponentType === TsPonentType.ObjectExpressionPonent) {
        if (this.members && this.members.length) {
          forOwn(this.members, (member: TsPonent) => {
            dependencies.push.apply(dependencies, member.extractExpressionPonentDependencies());
          });
        }

      } else if (this.ponentType === TsPonentType.ArrayExpressionPonent) {
        if (this.members && this.members.length) {
          this.members.forEach(member => {
            dependencies.push.apply(dependencies, member.extractExpressionPonentDependencies());
          });
        }

      } else {
        // some Angular metadata properties, such as, isolate;
      }
    }

    return dependencies;
  }

  traverse(callback: Function) {
    if (this.members) {
      this.members.some(member => {
        const result = callback.call(null, member);
        if (result === false) {
          return true;
        }

        member.traverse(callback);
      });
    }
  }

  getMetadata(property: MetadataProperty, ponentType = TsPonentType.StringExpressionPonent): TsPonent {
    let tsPonent: TsPonent = null;
    this.traverse((dir: TsPonent) => {
      if ( dir.ponentType === ponentType
        && dir.name === property
      ) {
        tsPonent = dir;
        return false;
      }
    });

    return tsPonent;
  }

  getMetadataValue(property: MetadataProperty): string {
    const tsPonent = this.getMetadata(property);
    return tsPonent.value.replace(/'/g, '');
  }

  findMemberWithTypeAndName(ponentType: TsPonentType, specificName?: string): TsPonent {
    let foundPonent: TsPonent = null;
    const findCallExpression = (memberPonent: TsPonent) => {
      if (memberPonent.ponentType === ponentType
          && (!specificName || memberPonent.name === specificName)) {
        foundPonent = memberPonent;
        return true;
      }
    };

    this.traverse(findCallExpression);

    return foundPonent;
  }
}

export enum MetadataProperty {
  Selector = 'selector',
  TemplateUrl = 'templateUrl'
}

export interface ImportThenInfo {
  _import: TsPonent;
  _then: TsPonent;
  importString: string;
  thenModule: any;
}

export function getImportThenInfo(tsPonent: TsPonent): ImportThenInfo {
  let importThenInfo: ImportThenInfo = null;
  const thenTsPonent = findThenTsPonent(tsPonent);

  if (thenTsPonent && thenTsPonent.nextTsPonent) {
    const importTsPonent = findTsPonentWithCondition(thenTsPonent.nextTsPonent, TsPonentType.ImportKeywordPonent);

    if (importTsPonent) {
      const importValuePonent = findTsPonentWithCondition(importTsPonent, TsPonentType.StringExpressionPonent);
      const thenValuePonent = findTsPonentWithCondition(thenTsPonent, TsPonentType.IdentifierExpressionPonent);

      importThenInfo = {
        _import: importTsPonent,
        _then: thenTsPonent,
        importString: importValuePonent ? importValuePonent.value : null,
        thenModule: thenValuePonent ? thenValuePonent.name : null
      };
    }
  }

  return importThenInfo;
}

export function findThenTsPonent(tsPonent: TsPonent): TsPonent {
  const isThen = (currTsPonent: TsPonent): boolean => {
    const statements = currTsPonent.name.split('.');
    const last = statements[statements.length - 1];
    return last === 'then';
  };

  const thenTsPonent = findTsPonentWithCondition(tsPonent, TsPonentType.CallExpressionPonent, isThen);
  return thenTsPonent;
}

export function findTsPonentWithCondition(tsPonent: TsPonent, tsPonentTypes: TsPonentType,
    condition?: (condTsPonent: TsPonent) => boolean): TsPonent {
  let found: TsPonent = null;

  tsPonent.traverse((currTsPonent: TsPonent) => {
    if (currTsPonent.ponentType === tsPonentTypes) {
      if (condition) {
        if (condition(currTsPonent) === true) {
          found = currTsPonent;
        }
      } else {
        found = currTsPonent;
      }

      if (found) {
        return false;
      }
    }
  });

  return found;
}
