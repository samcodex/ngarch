import { NgPonentType } from './../ngponent-tsponent/ngponent-definition';
import { TsPonent } from './../ngponent-tsponent/tsponent';
import { NgPonent } from './../ngponent-tsponent/ngponent';
import { ArchNgPonent } from './../arch-ngponent/arch-ngponent';
import { IArchNgPonentMetadata } from './../arch-ngponent/arch-ngponent-metadata-interface';


export class NgPipeMetadata implements IArchNgPonentMetadata {
  ngPonentType: NgPonentType = NgPonentType.Pipe;
  properties = ['name', 'pure'];
  usedProperties = [];

  name: string;
  pure?: boolean;

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
