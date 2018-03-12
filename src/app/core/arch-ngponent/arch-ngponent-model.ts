import { NgPonent, TsPonent, NgPonentType } from '../ngponent-tsponent';
import { ArchNgPonent } from './arch-ngponent';

export class ArchNgPonentModel extends ArchNgPonent {

  constructor(
    name: string,
    ngPonent: NgPonent,
    tsPonent: TsPonent
  ) {
    super(name, ngPonent, tsPonent, null, NgPonentType.Model);
  }

}
