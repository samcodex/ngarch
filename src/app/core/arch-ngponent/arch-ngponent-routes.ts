import { NgPonentType } from './../ngponent-tsponent/ngponent-definition';
import { NgPonent, TsPonent } from '../ngponent-tsponent';
import { ArchNgPonent } from './arch-ngponent';

export class ArchNgPonentRoutes extends ArchNgPonent {

  constructor(
    name: string,
    ngPonent: NgPonent,
    tsPonent: TsPonent
  ) {
    super(name, ngPonent, tsPonent, null, NgPonentType.Route);
  }

}
