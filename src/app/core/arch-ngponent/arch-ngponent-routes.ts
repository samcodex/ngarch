import { NgPonent, TsPonent } from '../ngponent-tsponent';
import { NgPonentType } from '../ngponent-tsponent/ngponent-definition';
import { ArchNgPonent } from './arch-ngponent';
import { ArchNgPonentRoute } from './arch-ngponent-route';

export class ArchNgPonentRoutes extends ArchNgPonent {

  children: ArchNgPonentRoute[] = [];

  constructor(
    name: string,
    ngPonent: NgPonent,
    tsPonent: TsPonent
  ) {
    super(name, ngPonent, tsPonent, null, NgPonentType.Routes);
  }

}
