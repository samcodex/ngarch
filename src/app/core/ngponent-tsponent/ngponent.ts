import { TsPonent } from './tsponent';
import { Deserializable } from '../serialization';

import { NgPonentType, NgDecoratorToPonentType, NgPonentFeature } from './ngponent-definition';
import { util } from './../util';

export class NgPonent implements Deserializable {
  public $clazz = 'NgPonent';

  public fileName: string;
  public name: string;

  public ponentType: NgPonentType;
  public ngPonentFeatures: NgPonentFeature[];
  public loadingGroup: string[];

  private tsPonent: TsPonent;

  constructor(tsPonent?: TsPonent, name?: string) {
    this.name = name;

    this.setTsPonent(tsPonent);
  }

  setTsPonent(tsPonent: TsPonent) {
    this.tsPonent = tsPonent;
    if (tsPonent) {
      tsPonent.ngPonent = this;

      const keys = Object.keys(NgDecoratorToPonentType);
      if (keys.indexOf(tsPonent.name) > -1) {
        this.ponentType = NgDecoratorToPonentType[tsPonent.name];
      }
    }
  }

  getTsPonent(): TsPonent {
    return this.tsPonent;
  }

  fromJson(data: object) {
    const tsPonent = new TsPonent();
    tsPonent.fromJson(data['tsPonent']);

    this.setTsPonent(tsPonent);

    const ps = ['$clazz', 'fileName', 'ponentType', 'name', 'ngPonentFeatures', 'loadingGroup'];
    util.copyProperty(this, data, ps);
  }
}
