
import { NgPonent } from './ngponent';
import { Deserializable } from '../serialization';

import { TsPonentType, TsPonentModifier, TsBasicType, IDataType } from './tsponent-definition';
import { TsDataType } from './tsdatatype';
import { util } from './../util';

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

  public ngPonent?: NgPonent;            // optional

  public parent?: TsPonent | null;
  public members?: Array<TsPonent>;    // optional

  constructor(parent?: TsPonent) {
    this.parent = parent;
  }

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

  initMembers() {
    if (!this.members) {
      this.members = new Array<TsPonent>();
    }
  }

  initModifiers() {
    if (!this.modifiers) {
      this.modifiers = new Array<TsPonentModifier>();
    }
  }

  fromJson(data: object) {
    const ps = ['$clazz', 'fileName', 'ponentType', 'name', 'modifiers', 'value', '_rawValue'];
    util.copyProperty(this, data, ps);

    const members: Array<TsPonent> = data['members'];
    if (members && members.length > 0) {
      this.members = members.map( m => {
        const ponent = new TsPonent(this);
        ponent.fromJson(m);

        return ponent;
      });
    }

    if ('_dataType' in data) {
      const dataType = data['_dataType'];
      if (typeof dataType === 'string') {
        this._dataType = TsBasicType[dataType];
      } else {
        const tsDataType = this._dataType = new TsDataType();
        tsDataType.fromJson(dataType);
      }
    }
  }
}
