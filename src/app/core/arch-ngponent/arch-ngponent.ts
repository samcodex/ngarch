import { ArchRelationship, RelationshipType, LogicalConnection } from '../arch-relationship';
import { NgPonent, PonentHelper, PonentTypesWithCtorParameters, PonentTypesWithServiceDependencies, TsPonent } from '../ngponent-tsponent';
import { NgPonentFeature, NgPonentType } from '../ngponent-tsponent/ngponent-definition';
import { ExpressionPonentTypes, TsPonentModifier, TsPonentType } from '../ngponent-tsponent/tsponent-definition';
import { ArchNgPonentComponent } from './arch-ngponent-component';
import { ArchNgPonentInjectable } from './arch-ngponent-injectable';
import { ArchNgPonentMetadata } from './arch-ngponent-metadata';
import { ArchNgPonentModule } from './arch-ngponent-module';
import { ArchNgPonentTsMembers } from './arch-ngponent-ts-members';
import { AngularFilePath } from '@core/models/angular-file-path';
import { ArchPonentFeature, ArchPonentIssue } from './arch-ngponent-definition';

const typeOrder: (NgPonentType | NgPonentFeature)[] =
  [NgPonentFeature.BootstrapModule, NgPonentFeature.LazyLoading, NgPonentType.NgModule,
    NgPonentType.Injectable, NgPonentType.Component, NgPonentType.Directive];

const listOfTsPonentMembers: NgPonentType[] = [ NgPonentType.Injectable, NgPonentType.Model ];

export abstract class ArchNgPonent {
  public readonly name: string;
  public readonly fileName: string;
  public readonly ngPonent: NgPonent;
  public readonly tsPonent: TsPonent;
  public readonly angularFilePath: AngularFilePath;

  public readonly ngPonentType: NgPonentType;
  // characteristic features
  public readonly ngPonentFeatures: NgPonentFeature[];
  public readonly loadingGroups: string[];

  public readonly archMetadata: ArchNgPonentMetadata;

  public readonly tsMembers: ArchNgPonentTsMembers;

  archRelationship: ArchRelationship;

  // It is for ui and coding, higher level than 'ngPonentFeatures'
  protected archFeatures: ArchPonentFeature[];

  issues: ArchPonentIssue[];
  suggestions: string[];

  static sort = (p1: ArchNgPonent, p2: ArchNgPonent) => p1.index - p2.index;
  // static filter = (type: NgPonentType) => (p: ArchNgPonent) => p.ngPonentType === type;

  constructor(
    name: string,
    ngPonent: NgPonent,
    tsPonent: TsPonent,
    archMetadata: ArchNgPonentMetadata,
    ngPonentType?: NgPonentType
  ) {
    this.name = name;
    this.tsPonent = tsPonent;

    if (ngPonent) {
      this.ngPonent = ngPonent;
      this.ngPonentFeatures = ngPonent.ngPonentFeatures;
      this.loadingGroups = ngPonent.loadingGroups;
      this.fileName = ngPonent.fileName;
      this.angularFilePath = new AngularFilePath(this.fileName);

      if (!this.tsPonent) {
        this.tsPonent = ngPonent.getTsPonent();
      }
    } else if (tsPonent) {
      this.fileName = tsPonent.fileName;
    }

    if (archMetadata) {
      this.archMetadata = archMetadata;
      this.ngPonentType = archMetadata.ngPonentType;

      this.buildMetadata();

      if (archMetadata.relationships) {
        this.archRelationship = new ArchRelationship(this);
      }
    } else {
      this.ngPonentType = ngPonentType;
    }

    if (this.isDecoratorWithTsMembers()) {
      this.tsMembers = new ArchNgPonentTsMembers(this.tsPonent);
    }
  }

  equalTo(ponent: ArchNgPonent): boolean {
    return this.ngPonentType === ponent.ngPonentType
      && this.name === ponent.name
      && this.fileName === ponent.fileName;
  }

  isDecoratorWithTsMembers(): boolean {
    return listOfTsPonentMembers.indexOf(this.ngPonentType) > -1;
  }

  get ponentId(): string {
    return this.fileName + '#' + this.name;
  }

  get index(): number {
    const type = this.ngPonentType;
    const feature = this.ngPonentFeatures ? this.ngPonentFeatures[0] : null;
    const index = typeOrder.indexOf(feature);
    const indexType = typeOrder.indexOf(type);
    return index === -1 ? (indexType === -1 ? 999 : indexType) : index;
  }

  get tsCtor(): TsPonent {
    return this.tsMembers ? this.tsMembers.ctor : null;
  }

  get tsCtorParameters(): TsPonent[] {
    return this.tsMembers ? this.tsMembers.ctorParameters : null;
  }

  get tsProperties(): TsPonent[] {
    return this.tsMembers ? this.tsMembers.properties : null;
  }

  get tsMethods(): TsPonent[] {
    return this.tsMembers ? this.tsMembers.methods : null;
  }

  get hasRelationship(): boolean {
    return !!this.archRelationship;
  }

  get hasDownConnection(): boolean {
    return !!this.archRelationship && this.archRelationship.hasDownConnection;
  }

  get hasUpConnection(): boolean {
    return !!this.archRelationship && this.archRelationship.hasUpConnection;
  }

  get namesOfLoadingGroup(): string[] {
    return this.loadingGroups;
  }

  get isNgModule(): boolean {
    return this.ngPonentType === NgPonentType.NgModule;
  }

  get isBootstrapModule(): boolean {
    return !!this.ngPonentFeatures && Array.isArray(this.ngPonentFeatures)
      && this.ngPonentFeatures.includes(NgPonentFeature.BootstrapModule);
  }

  get isRootOfLoadingGroup(): boolean {
    return !!this.loadingGroups && this.loadingGroups.includes(this.name);
  }

  get isIsolatedPonent(): boolean {
    return !this.hasUpConnection && !this.isRootOfLoadingGroup;
  }

  get allDependencies(): ArchNgPonent[] {
    if (this.archRelationship) {
      return this.archRelationship.downConnections.map(down => down.endOfArchPonent);
    } else {
      return null;
    }
  }

  appendArchFeature(feature: ArchPonentFeature) {
    if (!this.archFeatures) {
      this.archFeatures = [];
    }

    this.archFeatures.push(feature);
  }

  appendIssue(issue: ArchPonentIssue, suggestion: string) {
    if (!this.issues) {
      this.issues = [];
    }
    if (!this.suggestions) {
      this.suggestions = [];
    }

    this.issues.push(issue);
    this.suggestions.push(suggestion);
  }

  // should be overridden by the inherited class
  onlyInitNgFeatures() {
    if (!this.archFeatures) {
      this.archFeatures = [];
    }
  }

  setNgFeatures() {
    this.archFeatures = null;
  }

  hasNgFeature(feature: ArchPonentFeature): boolean {
    return !!this.archFeatures && Array.isArray(this.archFeatures)
      && this.archFeatures.length && this.archFeatures.includes(feature);
  }

  getProviderArchPonents(): ArchNgPonent[] {
    if (this.archRelationship) {
      return this.archRelationship.downConnections
        .filter(down => down.endOfPonentType === NgPonentType.Injectable)
        .map(down => down.endOfArchPonent);
    } else {
      return null;
    }
  }

  getSpecificDependencies(relationshipTypes: RelationshipType[],
      excludeTypes?: NgPonentType[], includeTypes?: NgPonentType[]): ArchNgPonent[] {
    const filterConnection = (connection: LogicalConnection): boolean => {
      let result = relationshipTypes.includes(connection.connectionType.type);

      if (result && !!excludeTypes) {
        result = !excludeTypes.includes(connection.endOfPonentType);
      }

      if (result && !!includeTypes) {
        result = includeTypes.includes(connection.endOfPonentType);
      }

      return result;
    };

    if (this.archRelationship) {
      return this.archRelationship.downConnections
        .filter(filterConnection)
        .map(down => down.endOfArchPonent);
    } else {
      return null;
    }
  }

  getArchMetadata<T extends ArchNgPonentMetadata>(): T {
    return this.archMetadata as T;
  }

  getMetadataOf<T extends ArchNgPonentMetadata, S>(property: string): S {
    const archMetadata = this.getArchMetadata<T>();
    return archMetadata.metadata[property] as S;
  }

  getMetaRefOf(property: string): TsPonent[] {
    const refs = this.archMetadata.__metaRefs;
    return property in refs ? refs[property] : null;
  }

  getSelfAndDependencies(): ArchNgPonent[] {
    let archNgPonents: ArchNgPonent[] = [ this ];

    const dependencies = this.allDependencies;
    if (dependencies) {
      archNgPonents = archNgPonents.concat(dependencies);
    }

    return archNgPonents;
  }

  getSelfAndSpecificDependencies(relationshipType: RelationshipType[], archPonents?: ArchNgPonent[]): ArchNgPonent[] {
    if (!archPonents) {
      archPonents = [ this ];
    }

    const dependencies = this.getSpecificDependencies(relationshipType);
    const rest: ArchNgPonent[] = [];

    dependencies.forEach(archPonent => {
      if (!archPonents.includes(archPonent)) {
        archPonents.push(archPonent);
        rest.push(archPonent);
      }
    });

    rest.forEach(ponent => {
      ponent.getSelfAndSpecificDependencies(relationshipType, archPonents);
    });

    return archPonents;
  }

  getSelfAndAllDependenciesInDeep(archPonents?: ArchNgPonent[]): ArchNgPonent[] {
    if (!archPonents) {
      archPonents = [ this ];
    }

    const dependencies = this.allDependencies;
    const rest: ArchNgPonent[] = [];

    dependencies.forEach(archPonent => {
      if (!archPonents.includes(archPonent)) {
        archPonents.push(archPonent);
        rest.push(archPonent);
      }
    });

    rest.forEach(ponent => {
      ponent.getSelfAndAllDependenciesInDeep(archPonents);
    });

    return archPonents;
  }

  listCtorDependencies(): string[] {
    if (PonentTypesWithServiceDependencies.indexOf(this.ngPonentType) > -1) {
      const dependencies = this.tsCtorParameters;
      return dependencies ? dependencies.map(dependency => dependency.dataType.trim()) : null;
    }

    return null;
  }

  listCtorParameters(): string[] {
    if (PonentTypesWithCtorParameters.indexOf(this.ngPonentType) > -1) {
      const dependencies = this.tsCtorParameters;
      return dependencies ? dependencies.map(dependency => `${dependency.name}: ${dependency.dataType}`) : null;
    }

    return null;
  }

  listClassProperties(): string[] {
    const properties = this.tsProperties;
    return properties ? properties.map(property => {
      const dataType = property.dataType;
      return property.name + (dataType ? `: ${dataType}` : '');
    }) : null;
  }

  listClassMethods(): string[] {
    const methods = this.tsMethods;

    return methods ? methods.map(method => {
      let modifier = ' + ';

      if (method.modifiers) {
        if (method.modifiers.indexOf(TsPonentModifier.PrivateKeyword) > -1) {
          modifier = ' - ';
        }
      }

      let returnType = method.dataType;
      returnType = returnType ? (': ' + returnType) : '';

      return `${modifier}${method.name}()${returnType}`;
    }) : null;
  }

  private buildMetadata() {
    const ponentType = this.ngPonent.ponentType;
    let members: TsPonent[];
    if (ponentType === NgPonentType.Route) {
      members = getRoutePonentMembers(this.ngPonent);
    } else if (ponentType === NgPonentType.ModuleWithProviders) {
      members = getModuleWithProviderPonentMembers(this.ngPonent);
    } else {
      members = getDecoratorPonentMembers(this.ngPonent);
    }

    if (!!members && members.length) {
      const archMetadata = this.archMetadata;
      const properties = archMetadata.properties;
      const metadata = archMetadata.metadata = {};

      members.forEach( elementPonent => {
        const propertyName = elementPonent.name;

        if (properties.indexOf(propertyName) > -1) {
          if (!(propertyName in metadata)) {
            // initialize metadata
            metadata[propertyName] = [];
          }
          const metadataProp = metadata[propertyName];
          this.archMetadata.appendMetaRefs(propertyName, elementPonent);

          if ('members' in elementPonent) {
            elementPonent.members.forEach(valPonent => {
              if (ExpressionPonentTypes.includes(valPonent.ponentType)) {
                let metaValue;

                if (valPonent.ponentType === TsPonentType.CallExpressionPonent
                    || 'members' in valPonent) {
                  metaValue = valPonent;

                } else if ('value' in valPonent) {
                  metaValue = valPonent.value;

                } else {
                  console.warn('[ERROR]ArchNgPonent.buildMetadata');
                  metaValue = undefined;
                }

                metadataProp.push(metaValue);
              }
            });

          } else if ('value' in elementPonent) {
            metadataProp.push(elementPonent.value);
          }

          archMetadata.usedProperties.push(propertyName);
        }
      });
    }
  }

  addRelationship(relationshipType: RelationshipType, endPonent: ArchNgPonent) {
    if (this.archRelationship) {
      this.archRelationship.addConnection(relationshipType, endPonent);
    }
  }
}

function getDecoratorPonentMembers(ngPonent: NgPonent): TsPonent[] {
  const ponentTypes = [TsPonentType.DecoratorPonent, TsPonentType.CallExpressionPonent,
    TsPonentType.ObjectExpressionPonent];
  return PonentHelper.getTsPonentMembers(ngPonent.getTsPonent(), ponentTypes);
}

function getModuleWithProviderPonentMembers(ngPonent: NgPonent): TsPonent[] {
  if (ngPonent.ponentType === NgPonentType.ModuleWithProviders) {
    const ponentTypes = [TsPonentType.MethodPonent, TsPonentType.ObjectExpressionPonent];
    return PonentHelper.getTsPonentMembers(ngPonent.getTsPonent(), ponentTypes);
  } else {
    return null;
  }
}

function getRoutePonentMembers(ngPonent: NgPonent): TsPonent[] {
  const ponentTypes = [TsPonentType.ObjectExpressionPonent];
  return PonentHelper.getTsPonentMembers(ngPonent.getTsPonent(), ponentTypes);
}

export function isArchService(ponent: ArchNgPonent): ponent is ArchNgPonentInjectable {
  return ponent instanceof ArchNgPonent && ponent.ngPonentType === NgPonentType.Injectable;
}

export function isArchModule(ponent: ArchNgPonent): ponent is ArchNgPonentModule  {
  return ponent instanceof ArchNgPonent && ponent.ngPonentType === NgPonentType.NgModule;
}

export function isArchComponent(ponent: ArchNgPonent): ponent is ArchNgPonentComponent  {
  return ponent instanceof ArchNgPonent && ponent.ngPonentType === NgPonentType.Component;
}
