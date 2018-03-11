import { TsPonentType, NgPonent, TsPonent } from '../ngponent-tsponent';
import { PonentHelper } from './ponent-helper';

export class ArchNgPonentTsMembers {
  tsPonent: TsPonent;
  tsPonentType: TsPonentType;

  properties: TsPonent[];
  ctor: TsPonent;
  methods: TsPonent[];

  constructor(tsPonent: TsPonent) {
    this.tsPonent = tsPonent;
    this.tsPonentType = tsPonent.ponentType;

    this.buildTsMembers();
  }

  private buildTsMembers() {
    const tsPonent = this.tsPonent;

    const ctor = PonentHelper.iterateTsPonent(tsPonent, [TsPonentType.ConstructorPonent]);
    this.properties = PonentHelper.iterateTsPonent(tsPonent, [TsPonentType.PropertyPonent]);
    this.methods = PonentHelper.iterateTsPonent(tsPonent, [TsPonentType.MethodPonent]);
    this.ctor = ctor[0];
  }

  get ctorParameters(): TsPonent[] {
    return PonentHelper.iterateTsPonent(this.ctor, [TsPonentType.ConstructorPonent, TsPonentType.ParameterPonent]);
  }

}
