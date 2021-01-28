import { RelationshipType } from '../arch-relationship';
import { NgPonent } from '../ngponent-tsponent/ngponent';
import { NgPonentType } from '../ngponent-tsponent/ngponent-definition';
import { TsPonent } from '../ngponent-tsponent/tsponent';
import { ArchNgPonent } from './arch-ngponent';
import { ArchNgPonentMetadata, ArchNgPonentMetadataKeys } from './arch-ngponent-metadata';


export class NgDirectiveMetadata extends ArchNgPonentMetadata {
  ngPonentType: NgPonentType = NgPonentType.Directive;
  properties = ['selector', 'inputs', 'outputs', 'host', 'providers', 'exportAs', 'queries'];
  usedProperties = [];

  metadata: {
    selector?: string,
    inputs?: string[],
    outputs?: string[],
    host?: {[key: string]: string},
    providers?: any[],
    exportAs?: string,
    queries?: {[key: string]: any}
  };

  descriptions = {
      'selector': 'css selector that identifies this component in a template',
      'inputs': 'list of class property names to data-bind as component inputs',
      'outputs': 'list of class property names that expose output events that others can subscribe to',
      'host': 'map of class property to host element bindings for events, properties and attributes',
      'providers': 'list of providers available to this component and its children',
      'exportAs': 'name under which the component instance is exported in a template. Can be given a single name or a comma-delimited list of names.',
      'queries': 'configure queries that can be injected into the component',
  };

  relationships = {
    entryComponents: RelationshipType.Composite,
    providers: RelationshipType.Aggregation,
    viewProviders: RelationshipType.Aggregation,
    [ArchNgPonentMetadataKeys.Ctor]: RelationshipType.Dependency
  };
}

export class ArchNgPonentDirective extends ArchNgPonent {

  constructor(
    name: string,
    ngPonent: NgPonent,
    tsPonent: TsPonent
  ) {
    super(name, ngPonent, tsPonent, new NgDirectiveMetadata());
  }

  getProvidersOfInjector(): ArchNgPonent[] {
    return this.archRelationship ? this.archRelationship.getArchNgPonentOfProvidersOfInjector() : null;
  }

  getDependenciesOfCtorInjectable(): ArchNgPonent[] {
    return this.archRelationship ? this.archRelationship.getArchNgPonentOfDependenciesFromCtor() : null;
  }
}
