import { RelationshipType } from '../arch-relationship';
import { NgPonent } from '../ngponent-tsponent/ngponent';
import { NgPonentType } from '../ngponent-tsponent/ngponent-definition';
import { TsPonent } from '../ngponent-tsponent/tsponent';
import { ArchNgPonent } from './arch-ngponent';
import { ArchNgPonentMetadata } from './arch-ngponent-metadata';


export class NgModuleWithProviderMetadata extends ArchNgPonentMetadata {
  ngPonentType: NgPonentType = NgPonentType.ModuleWithProviders;
  properties = ['ngModule', 'providers'];
  usedProperties = [];

  metadata: {
    ngModule: any,
    providers?: any[],
  };

  descriptions = {
    ngModule: 'The current module name',
    providers: 'Defines the set of injectable objects that are available in the injector of this module',
  };

  relationships = {
    providers: RelationshipType.Aggregation,
  };
}

export class ArchNgPonentModuleWithProvider extends ArchNgPonent {

  constructor(
    name: string,
    ngPonent: NgPonent,
    tsPonent: TsPonent
  ) {
    super(name, ngPonent, tsPonent, new NgModuleWithProviderMetadata());
  }

}
