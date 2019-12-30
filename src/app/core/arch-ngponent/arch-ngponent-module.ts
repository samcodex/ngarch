import { RelationshipType } from '../arch-relationship';
import { NgPonent } from '../ngponent-tsponent/ngponent';
import { NgPonentType } from '../ngponent-tsponent/ngponent-definition';
import { TsPonent } from '../ngponent-tsponent/tsponent';
import { ArchNgPonent } from './arch-ngponent';
import { ArchNgPonentMetadata } from './arch-ngponent-metadata';
import { ArchPonentFeature } from './arch-ngponent-definition';

export class NgModuleMetadata extends ArchNgPonentMetadata {
  ngPonentType: NgPonentType = NgPonentType.NgModule;
  properties = ['providers', 'declarations', 'imports',
    'exports', 'entryComponents', 'bootstrap', 'schemas', 'id'];
  usedProperties = [];

  metadata: {
    providers?: any[],
    declarations?: Array<any[]>,
    imports?: Array<string | TsPonent>,
    exports?: Array<any[]>,
    entryComponents?: Array<any[]>,
    bootstrap?: Array<any[]>,
    schemas?: Array<any[]>,
    id?: string
  };

  descriptions = {
    providers: 'Defines the set of injectable objects that are available in the injector of this module',
    declarations: 'Specifies a list of components/directives/pipes that belong to this module',
    imports: 'Specifies a list of modules whose exported components/directives/pipes should be available to templates in this module. This can also contain ModuleWithProviders',
    exports: 'Specifies a list of components/directives/pipes/modules that can be used within the template of any component that is part of an Angular module that imports this Angular module',
    entryComponents: 'Specifies a list of components that should be compiled when this module is defined.',
    bootstrap: 'Defines the components that should be bootstrapped when this module is bootstrapped. The components listed here will automatically be added to "entryComponents".',
    schemas: 'Elements and properties that are not Angular components nor directives have to be declared in the schema.',
    id: 'An opaque ID for this module, e.g. a name or a path. Used to identify modules in `getModuleFactory`. If left `undefined`, the `NgModule` will not be registered with `getModuleFactory`.'
  };

  relationships = {
    imports: RelationshipType.Dependency,
    declarations: RelationshipType.Composite,
    providers: RelationshipType.Aggregation,
    exports: RelationshipType.Aggregation
  };
}

export class ArchNgPonentModule extends ArchNgPonent {

  constructor(
    name: string,
    ngPonent: NgPonent,
    tsPonent: TsPonent
  ) {
    super(name, ngPonent, tsPonent, new NgModuleMetadata());
  }

  getProvidersOfInjector(): ArchNgPonent[] {
    return this.archRelationship ? this.archRelationship.getArchNgPonentOfProvidersOfInjector() : null;
  }

  setNgFeatures() {
    const imports = this.getMetadataOf<NgModuleMetadata, (string | TsPonent)[]>('imports');
    imports
      .filter(impt => impt instanceof TsPonent)
      .forEach((impt: TsPonent) => {
        if (impt.name === 'RouterModule.forRoot') {
          this.onlyInitNgFeatures();
          this.appendArchFeature(ArchPonentFeature.RouterModuleForRoot);
        } else if (impt.name === 'RouterModule.forChild') {
          this.onlyInitNgFeatures();
          this.appendArchFeature(ArchPonentFeature.RouterModuleForChild);
        }
      });
  }
}
