import { NgPonent } from '../ngponent-tsponent/ngponent';
import { NgPonentType } from '../ngponent-tsponent/ngponent-definition';
import { TsPonent } from '../ngponent-tsponent/tsponent';
import { ArchNgPonent } from './arch-ngponent';
import { ArchNgPonentMetadata } from './arch-ngponent-metadata';


export class NgPipeMetadata extends ArchNgPonentMetadata {
  ngPonentType: NgPonentType = NgPonentType.Pipe;
  properties = ['name', 'pure'];
  usedProperties = [];

  metadata: {
    name: string,
    pure?: boolean
  };

  descriptions = {
    name: '',
    pure: '',
  };
}

export class ArchNgPonentPipe extends ArchNgPonent {

  constructor(
    name: string,
    ngPonent: NgPonent,
    tsPonent: TsPonent
  ) {
    super(name, ngPonent, tsPonent, new NgPipeMetadata());
  }

}
