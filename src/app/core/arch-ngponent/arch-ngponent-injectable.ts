import { RelationshipType } from '../arch-relationship';
import { NgPonent } from '../ngponent-tsponent/ngponent';
import { NgPonentType } from '../ngponent-tsponent/ngponent-definition';
import { TsPonent } from '../ngponent-tsponent/tsponent';
import { ArchNgPonent } from './arch-ngponent';
import { ArchNgPonentMetadata, ArchNgPonentMetadataKeys } from './arch-ngponent-metadata';


export class NgInjectableMetadata extends ArchNgPonentMetadata {
  ngPonentType: NgPonentType = NgPonentType.Injectable;
  properties = [];

  usedProperties = [];
  metadata: null;
  descriptions = null;

  relationships = {
    [ArchNgPonentMetadataKeys.Ctor]: RelationshipType.Dependency
  };
}

export class ArchNgPonentInjectable extends ArchNgPonent {

  constructor(
    name: string,
    ngPonent: NgPonent,
    tsPonent: TsPonent
  ) {
    super(name, ngPonent, tsPonent, new NgInjectableMetadata());
  }

  getDependenciesOfCtorInjectable(): ArchNgPonent[] {
    return this.archRelationship ? this.archRelationship.getArchNgPonentOfDependenciesFromCtor() : null;
  }
}
