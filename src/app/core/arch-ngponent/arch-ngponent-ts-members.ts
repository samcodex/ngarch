import { TsPonent } from '../ngponent-tsponent/tsponent';
import { TsPonentType } from '../ngponent-tsponent/tsponent-definition';
import { PonentHelper } from '../ngponent-tsponent/ponent-helper';

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
    const ctor = PonentHelper.filterTsPonentMembersByType(tsPonent, [TsPonentType.ConstructorPonent]);

    this.ctor = Array.isArray(ctor) ? ctor[0] : null;
    this.properties = PonentHelper.filterTsPonentMembersByType(tsPonent, [TsPonentType.PropertyPonent]);
    this.methods = PonentHelper.filterTsPonentMembersByType(tsPonent, [TsPonentType.MethodPonent]);
  }

  get ctorParameters(): TsPonent[] {
    return PonentHelper.filterTsPonentMembersByType(this.ctor, [TsPonentType.ConstructorPonent, TsPonentType.ParameterPonent]);
  }

}
