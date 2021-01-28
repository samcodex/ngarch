import { RelationshipType } from '@core/arch-relationship/relationship-definition';
import { DiagramOptions, mapElementTypeToNgPonentType } from '@core/diagram-element-linkable';
import { UiElementCategory } from '@core/models/ui-element-category';
import { UiElementItem } from '@core/models/ui-element-item';
import { relationshipTypesOfComposition, relationshipTypesOfDependency } from '@core/arch-relationship';
import { MetaValue } from '@core/models/meta-data';

export enum MokuaiOptionCatType {
  Angular = 'Angular',
  Specific = 'Specific',
  Relationship = 'Relationship',
  Connection = 'Connection',
  NotationOption = 'NotationOption',
  ServiceNotation = 'ServiceNotation'
}

export type MokuaiOptionCategory = UiElementCategory<MokuaiOptionCatType>;

export type MokuaiOptionCategories = Array<MokuaiOptionCategory>;

const specificElementsConvertor = (items: UiElementItem[]): string[] =>
  items
    .filter((item: UiElementItem) => item.isUsed && !item.isDisabled && !item.isChecked)
    .map(item => item.name);

const relationshipConvertor = (items: UiElementItem[]) => {
  return null;
};

const mapWith = (property: string) =>
  (items: UiElementItem[]) =>
    items
      .filter((item: UiElementItem) => item.isUsed && !item.isDisabled && item.isChecked)
      .map( item => item[property]);

const mapOfConvertor: { [ key: string]: Function } = {
  [ MokuaiOptionCatType.Angular ]: mapWith('type'),
  [ MokuaiOptionCatType.Specific ]: specificElementsConvertor,
  [ MokuaiOptionCatType.Relationship ]: relationshipConvertor,
  [ MokuaiOptionCatType.Connection ]: mapWith('value'),
  [ MokuaiOptionCatType.NotationOption]: mapWith('value'),
  [ MokuaiOptionCatType.ServiceNotation]: mapWith('value')
};

export function convertOptionCategoriesToDiagramOptions(optCategories: MokuaiOptionCategories): DiagramOptions {
  const options = {};
  optCategories.forEach( category => {
    options[category.type] = mapOfConvertor[category.type].call(null, category.items);
  });
  const elementTypes = options[MokuaiOptionCatType.Angular];

  const diagramOptions = new DiagramOptions();
  diagramOptions.hiddenPonentName = options[MokuaiOptionCatType.Specific];
  diagramOptions.archNgPonentTypes = elementTypes ? elementTypes.map(mapElementTypeToNgPonentType) : null;
  diagramOptions.relationship = null;
  diagramOptions.connection = options[MokuaiOptionCatType.Connection];
  diagramOptions.notationOptions = options[MokuaiOptionCatType.NotationOption];
  diagramOptions.serviceNotations = options[MokuaiOptionCatType.ServiceNotation];

  return diagramOptions;
}

export const mapOptionToRelationshipType: { [ key: string]: RelationshipType[] } = {
  [ MetaValue.Composition ]: relationshipTypesOfComposition,
  [ MetaValue.Dependency ]: relationshipTypesOfDependency
};
