import { get, forOwn } from 'lodash/get';

import { TsPonentType, TsPonentModifier} from '../ngponent-tsponent/tsponent-definition';
import { NgPonentType, NgPonentFeature } from './../ngponent-tsponent/ngponent-definition';
import { TsPonent, NgPonent, PonentTypesWithServiceDependencies,
  PonentTypesWithCtorParameters } from './../ngponent-tsponent';
import { PonentHelper } from './ponent-helper';
import { IArchNgPonentMetadata } from './../arch-ngponent/arch-ngponent-metadata-interface';
import { DiagramItemType } from './../diagram/diagram-item-type';
import { IDiagramItem } from './../diagram/diagram-item-interface';
import { ArchNgPonentTsMembers } from './arch-ngponent-ts-members';

const typeOrder: (NgPonentType | NgPonentFeature)[] =
  [NgPonentFeature.BootstrapModule, NgPonentFeature.LazyLoading, NgPonentType.NgModule,
    NgPonentType.Injectable, NgPonentType.Component, NgPonentType.Directive];

const typeListOfTsPonentMembers = [NgPonentType.Injectable, NgPonentType.Model];

export abstract class ArchNgPonent {
  public readonly name: string;
  public readonly fileName: string;
  public readonly ngPonent: NgPonent;
  public readonly tsPonent: TsPonent;

  public readonly ngPonentType: NgPonentType;
  public readonly metadata: IArchNgPonentMetadata;
  public readonly ngPonentFeatures: NgPonentFeature[];
  public readonly tsMembers: ArchNgPonentTsMembers;

  static sort = (p1: ArchNgPonent, p2: ArchNgPonent) => p1.index - p2.index;
  static filter = function(type: NgPonentType){
    return (p: ArchNgPonent) => p.ngPonentType === type;
  };

  constructor(
    name: string,
    ngPonent: NgPonent,
    tsPonent: TsPonent,
    metadata: IArchNgPonentMetadata,
    ngPonentType?: NgPonentType
  ) {
    this.name = name;
    this.tsPonent = tsPonent;

    if (ngPonent) {
      this.ngPonent = ngPonent;
      this.ngPonentFeatures = ngPonent.ngPonentFeatures;
      this.fileName = ngPonent.fileName;
    } else if(tsPonent) {
      this.fileName = tsPonent.fileName;
    }

    if (metadata) {
      this.metadata = metadata;
      this.ngPonentType = metadata.ngPonentType;

      this.buildMetadata();
    } else {
      this.ngPonentType = ngPonentType;
    }

    if (typeListOfTsPonentMembers.indexOf(this.ngPonentType) > -1) {
      this.tsMembers = new ArchNgPonentTsMembers(this.tsPonent);
    }
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

  listDependencies(): string[] {
    if (PonentTypesWithServiceDependencies.indexOf(this.ngPonentType) > -1) {
      const dependencies = this.tsCtorParameters;
      return dependencies ? dependencies.map(dependency => dependency.dataType) : null;
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

  listProperties(): string[] {
    const properties = this.tsProperties;
    return properties ? properties.map(property => {
      const dataType = property.dataType;
      return property.name + (dataType ? `:${dataType}` : '');
    }) : null;
  }

  listMethods(): string[] {
    const methods = this.tsMethods;

    return methods ? methods.map(method => {
      let modifier = ' + ';

      if (method.modifiers) {
        if (method.modifiers.indexOf(TsPonentModifier.PrivateKeyword) > -1) {
          modifier = ' - ';
        }
      }

      let returnType = method.dataType;
      returnType = returnType ? returnType : '';

      return `${modifier}${method.name}()${returnType}`;
    }) : null;
  }

  private buildMetadata() {
    const metadata = this.metadata;
    const properties = metadata.properties;
    const members: TsPonent[] = getDecoratorValues(this.ngPonent);

    if (members) {
        members.forEach( m => {
        const name = m.name;

        if (properties.indexOf(name) > -1) {
          if ('members' in m) {
            const valPonent = m.members[0];

            if (valPonent.ponentType === TsPonentType.ValuePonent) {
              metadata[name] = valPonent.value;
              metadata.usedProperties.push(name);
            }
          } else if ('value' in m) {
            metadata[name] = m.value;
            metadata.usedProperties.push(name);
          } else {
            console.log('TODO - buildMetadata');
          }
        }
      });
    }
  }

  convertToDiagramItem(): IDiagramItem[] {
    if (typeListOfTsPonentMembers.indexOf(this.ngPonentType) > -1) {
      return this.convertTsMembersToDiagramItem();
    } else {
      return this.convertMetadataToDiagramItem();
    }
  }

  convertMetadataToDiagramItem(): IDiagramItem[] {
    const items: IDiagramItem[] = new Array<IDiagramItem>();
    const metadata = this.metadata;
    const usedProperties = metadata.usedProperties;

    // the name of ngPonent
    // items.push({itemType: DiagramItemType.ElementName, value: this.name, link: null });

    // the declaration of ngPonent
    usedProperties.forEach(p => {
      if (p in metadata) {
        const decValue = metadata[p];

        let tip = null;
        if (metadata.descriptions) {
          tip = metadata.descriptions[p];
        }

        items.push( { itemType: DiagramItemType.SessionName, value: p, tip: tip } );

        if (Array.isArray(decValue)) {
          decValue.forEach(val => {
            items.push( { itemType: DiagramItemType.ElementItem, value: val } );
          });
        } else {
          items.push( { itemType: DiagramItemType.ElementItem, value: decValue } );
        }
      }
    });

    return items;
  }

  convertTsMembersToDiagramItem(): IDiagramItem[] {
    const dependencies = this.listDependencies();
    const ctorParameters = this.listCtorParameters();
    const properties = this.listProperties();
    const methods = this.listMethods();

    const items: IDiagramItem[] = new Array<IDiagramItem>();

    if (PonentTypesWithServiceDependencies.indexOf(this.ngPonentType) > -1) {
      // dependencies
      if (dependencies) {
        items.push( { itemType: DiagramItemType.SessionName, value: 'Dependencies' } );
        items.push.apply(items, dependencies.map( d => ({ itemType: DiagramItemType.ElementItem, value: d })));
      }
    } else if (PonentTypesWithCtorParameters.indexOf(this.ngPonentType) > -1) {
      // constructor parameters
      if (ctorParameters) {
        items.push( { itemType: DiagramItemType.SessionName, value: 'Constructor' } );
        items.push.apply(items, ctorParameters.map( d => ({ itemType: DiagramItemType.ElementItem, value: d })));
      }
    }

    // properties
    if (properties) {
      items.push( { itemType: DiagramItemType.SessionName, value: 'Properties' } );
      items.push.apply(items, properties.map( d => ({ itemType: DiagramItemType.ElementItem, value: d })));
    }

    // methods
    if (methods) {
      items.push( { itemType: DiagramItemType.SessionName, value: 'Methods' } );
      items.push.apply(items, methods.map( d => ({ itemType: DiagramItemType.ElementItem, value: d })));
    }

    return items;
  }
}


function getDecoratorValues(ngPonent: NgPonent): TsPonent[] | null {
  const tsPonent = PonentHelper.iterateTsPonent(ngPonent.getTsPonent(),
    [TsPonentType.DecoratorPonent, TsPonentType.ArgumentPonent]);

  return tsPonent ? tsPonent[0].members : null;
}


// ===========================================
// function getDecoratorValues(ngPonent: NgPonent): TsPonent[] | null {
//   let tsPonents: TsPonent[] = null;

//   const decoratePonent = ngPonent.tsPonent;
//   const members = getMembers(decoratePonent, TsPonentType.DecoratorPonent);
//   if (Array.isArray(members) && members.length > 0) {
//     tsPonents = getMembers(members[0], TsPonentType.ArgumentPonent);
//   }

//   const result = iterateTsPonent(ngPonent.tsPonent, [TsPonentType.DecoratorPonent, TsPonentType.ArgumentPonent]);
//   const value = result ? result[0].members : null;
//   console.log(tsPonents, value);

//   return value;
// }

// function getMembers(tsPonent: TsPonent, type: TsPonentType): TsPonent[] {
//   if (tsPonent && tsPonent.ponentType === type && 'members' in tsPonent) {
//     return tsPonent.members;
//   }
//   return null;
// }
