import { InjectionToken } from '@angular/core';

import { DiagramLinkableElement } from '@core/diagram-element-linkable';
import { ArchNgPonent } from '@core/arch-ngponent/arch-ngponent';
import { DiagramOptions } from '@core/diagram-element-linkable/diagram-options';
import { ArchStoreData } from '@shared/arch-ngponent-store/models/arch-store-data';
import { BasicDiagramElementBuilder } from '@core/diagram-impls/element/basic-diagram/basic-diagram-element-builder';
import { HierarchyElementBuilder } from './../diagram-impls/element/d3-hierarchy-element/hierarchy-element-builder';

/*
* for passing class and dynamic create instance
* 1. defines Constructor, which is a new method with signature
* 2. defines interface
* 3. defines create function
*/

// defines constructor for passing the class. It also uses in builders config
// defines the new method signature
export interface ElementBuilderConstructor {
  new (
     archNgPonent: ArchNgPonent,
     diagramOptions: DiagramOptions,
     storeData: ArchStoreData
  ): ElementBuilder;
}

// the required interface, a real interface/data type
export interface ElementBuilder {
  convertToDiagramElement(): DiagramLinkableElement;
}

// for dynamic create the instance of the builder base on the passed constructor
export function createElementBuilder(
  ctor: ElementBuilderConstructor,
  archNgPonent: ArchNgPonent,
  diagramOptions: DiagramOptions,
  storeData: ArchStoreData
): ElementBuilder {
  return new ctor(archNgPonent, diagramOptions, storeData);
}

// ------- config
// the builders config
export const MapOfDiagramElementBuilder: { [ key: string ]: ElementBuilderConstructor } = {
  Default: BasicDiagramElementBuilder,
  Hierarchy: HierarchyElementBuilder
};

// builder injection token, which is one builder class
export const DiagramElementBuilder = new InjectionToken<ElementBuilderConstructor>('Diagram Element Builder');
