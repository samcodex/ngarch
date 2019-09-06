import { forOwn, get } from 'lodash-es';

import { ArchNgPonent, ArchNgPonentMetadataKeys, RelationshipWithinNgPonents } from '@core/arch-ngponent';
import { RelationshipType } from '@core/arch-relationship';
import { NgPonentType, TsPonent } from '@core/ngponent-tsponent';
import { ArchStoreData } from './arch-store-data';
import { NgTemplateElement } from '@core/ngponent-tsponent/ng-template';

// implement the relation for Ponent itself. This is Ponent's property 'relation'
export class PonentRelationBuilder {
  constructor(
    private _storeData: ArchStoreData,
    private _archPonents: ArchNgPonent[]
  ) { }

  updateRelationship() {
    // traverser ArchNgPonent
    this._archPonents
      .filter( archPonent => {
        const ponentType = archPonent.ngPonentType;
        const archMetadata = archPonent.archMetadata;
        const metadata = archMetadata ? archMetadata.metadata : null;
        const relationships: {[key: string]: RelationshipType} = archMetadata ? archMetadata.relationships : null;

        return archMetadata && metadata && relationships && RelationshipWithinNgPonents.includes(ponentType);
      })
      .forEach( archPonent => {
        const metadata = archPonent.archMetadata.metadata;
        const relationships: {[key: string]: RelationshipType} = archPonent.archMetadata.relationships;
        const relationHost = this.findHostPonent(archPonent);

        let relationItems: Array<string | TsPonent>;
        // loop the relationships
        forOwn(relationships, (relationshipType: RelationshipType, relationshipProperty: string) => {
          // get all relationship values with relationship property
          if (relationshipProperty === ArchNgPonentMetadataKeys.Ctor) {   // Component, Directive, Injectable
            // string[]
            relationItems = archPonent.listCtorDependencies();    // string[]
          } else if (relationshipProperty === ArchNgPonentMetadataKeys.Template) {    // Component
            const templateElements = archPonent.ngPonent.flatTemplateElements();
            // string[]
            relationItems = templateElements ? templateElements
              .filter(templateElement => !!templateElement.ngPonentId)
              .map(NgTemplateElement.getNgPonentName) : null;
          } else {
            // string or TsPonent which is forRoot or forChildren
            relationItems = get(metadata, relationshipProperty);
          }

          // build relationship base on the relationship values
          /* For example: NgModule - imports, declarations, providers, exports
          */
          if (relationItems) {
            relationItems.forEach(item => {
              if (typeof item === 'string') {
                this.addRelationship(relationshipType, relationHost, item);
              } else if (item instanceof TsPonent) {
                // For example: imports: forRoot or forChildren, CallExpression
                // 'dependencies' contains callee and parameters
                const dependencies = item.extractExpressionPonentDependencies();
                dependencies.forEach(this.addRelationship.bind(this, relationshipType, relationHost));
              } else {
                console.warn('updateRelationship - error', item);
              }
            });
          }
        });
      });
  }

  private addRelationship(relationshipType: RelationshipType, relationHost: ArchNgPonent, relationName: string) {
    if (relationHost) {
      const refPonent = this._storeData.resolveArchNgPonent(relationHost.fileName, relationName);
      if (refPonent && RelationshipWithinNgPonents.includes(refPonent.ngPonentType)) {
        relationHost.addRelationship(relationshipType, refPonent);
      }
    }
  }

  private findHostPonent(archPonent: ArchNgPonent): ArchNgPonent {
    let relationHost = archPonent;
    const isModuleWithProviders = archPonent.ngPonentType === NgPonentType.ModuleWithProviders;

    if (isModuleWithProviders) {
      const parentPonent = archPonent.tsPonent.parent;
      if (parentPonent) {
        relationHost = this._storeData.findPonentByName( parentPonent.name, parentPonent.fileName);
      }
    }

    return relationHost;
  }
}
