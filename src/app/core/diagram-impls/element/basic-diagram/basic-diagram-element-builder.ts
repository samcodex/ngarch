import { forOwn } from 'lodash-es';

import { ArchStoreData } from '@shared/arch-ngponent-store';
import { ArchNgPonent, isArchService } from '@core/arch-ngponent';
import { DiagramItem, DiagramItemType } from '@core/diagram-element-linkable/diagram-item';
import { DiagramOptions } from '@core/diagram-element-linkable/diagram-options';
import { PonentTypesWithCtorParameters, PonentTypesWithServiceDependencies, TsPonent } from '@core/ngponent-tsponent';
import { ElementBuilder } from '@core/diagram/element-builder';
import { mapNgPonentTypeToElementType } from '@core/diagram-element-linkable/diagram-linkable-definition';
import { DiagramLinkableElement } from '@core/diagram-element-linkable';
import { BasicDiagramElement } from './basic-diagram-element';

const displayLengthMetadata = 50;

export class BasicDiagramElementBuilder implements ElementBuilder {
  constructor(
    private archNgPonent: ArchNgPonent,
    private diagramOptions: DiagramOptions,
    private storeData: ArchStoreData
  ) {
  }

  convertToDiagramElement(): DiagramLinkableElement {
    const needFilterNotation = !this.diagramOptions ||
      (this.diagramOptions.hasNotationComplete() || this.diagramOptions.hasNotationApplication());

    let drawData = null;
    if (needFilterNotation) {
      if (this.archNgPonent.isDecoratorWithTsMembers()) {
        drawData = this.convertTsMembersToDiagramItem();
      } else {
        drawData = this.convertMetadataToDiagramItem();
      }
    }

    const elementType = mapNgPonentTypeToElementType(this.archNgPonent.ngPonentType);
    const element: BasicDiagramElement = new BasicDiagramElement(elementType, this.archNgPonent);
    element.setData(drawData);

    return element;
  }

  private convertMetadataToDiagramItem(): DiagramItem[] {
    const items: DiagramItem[] = new Array<DiagramItem>();
    const archMetadata = this.archNgPonent.archMetadata;
    const metadata = archMetadata ? archMetadata.metadata : null;
    const hasImportExternalModule = !this.diagramOptions || this.diagramOptions.hasNotationComplete();

    // the name of ngPonent
    // items.push({itemType: DiagramItemType.ElementName, value: this.name, link: null });

    // the declaration of ngPonent
    forOwn(metadata, (metaValue, usedProperty) => {
      const decValue: any[] = Array.isArray(metaValue) ? metaValue : [metaValue];
      const tip = archMetadata.descriptions ? archMetadata.descriptions[usedProperty] : null;

      items.push( { itemType: DiagramItemType.SectionName, value: usedProperty, tip } );
      // if (decValue.length >= 10) {
      //   items.push( {itemType: DiagramItemType.SectionFlagLess, value: true} );
      // }

      decValue.forEach((decItem: any) => {
        let isValidItem = true;
        const displayValue = decItem instanceof TsPonent ? decItem.expressionPonentToString() : decItem;

        if (this.archNgPonent.isNgModule && !hasImportExternalModule) {
          const hasPonent = this.storeData.tryFindModulePonentByName(displayValue);
          isValidItem = !!hasPonent;
        }

        if (isValidItem) {
          const metaItem: DiagramItem = truncateValue({ itemType: DiagramItemType.ElementItem, value: displayValue });
          items.push( metaItem );
        }

      });
    });

    return items;
  }

  private convertTsMembersToDiagramItem(): DiagramItem[] {
    const dependencies = this.archNgPonent.listCtorDependencies();
    const ctorParameters = this.archNgPonent.listCtorParameters();
    const properties = this.archNgPonent.listClassProperties();
    const methods = this.archNgPonent.listClassMethods();
    const diagramOptions = this.diagramOptions;
    const isService = isArchService(this.archNgPonent);

    const items: DiagramItem[] = new Array<DiagramItem>();

    if (PonentTypesWithServiceDependencies.indexOf(this.archNgPonent.ngPonentType) > -1) {
      // dependencies
      const hasServiceDependencies = isService ? !diagramOptions || diagramOptions.hasServiceDependencies() : true;
      if (dependencies && hasServiceDependencies) {
        items.push( { itemType: DiagramItemType.SectionName, value: 'Dependencies' } );
        items.push.apply(items, dependencies.map( d => truncateValue({ itemType: DiagramItemType.ElementItem, value: d })));
      }
    }

    if (PonentTypesWithCtorParameters.indexOf(this.archNgPonent.ngPonentType) > -1) {
      // constructor parameters
      const hasServiceConstructor = isService ? !diagramOptions || diagramOptions.hasServiceConstructor() : true;
      if (ctorParameters && hasServiceConstructor) {
        items.push( { itemType: DiagramItemType.SectionName, value: 'Constructor' } );
        items.push.apply(items, ctorParameters.map( d => truncateValue({ itemType: DiagramItemType.ElementItem, value: d })));
      } else {
        // @Todo - no constructor or constructor without parameters
      }
    }

    // properties
    const hasServiceProperties = isService ? !diagramOptions || diagramOptions.hasServiceProperties() : true;
    if (properties && hasServiceProperties) {
      items.push( { itemType: DiagramItemType.SectionName, value: 'Properties' } );
      items.push.apply(items, properties.map( d => truncateValue({ itemType: DiagramItemType.ElementItem, value: d })));
    }

    // methods
    const hasServiceMethods = isService ? !diagramOptions || diagramOptions.hasServiceMethods() : true;
    if (methods && hasServiceMethods) {
      items.push( { itemType: DiagramItemType.SectionName, value: 'Methods' } );
      items.push.apply(items, methods.map( d => truncateValue({ itemType: DiagramItemType.ElementItem, value: d })));
    }

    return items;
  }
}

function truncateValue(item: DiagramItem): DiagramItem {
  const value = item.value;
  if (value.length > displayLengthMetadata) {
    item.tip = value;
    item.value = value.substr(0, displayLengthMetadata - 10) + ' ......';
  }
  return item;
}
