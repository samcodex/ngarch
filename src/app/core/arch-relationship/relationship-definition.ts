import { ArchNgPonent } from '../arch-ngponent';
import { NgPonentType } from '../ngponent-tsponent';

export enum RelationshipType {
  Association = 'Association',
  Aggregation = 'Aggregation',
  Composite = 'Composite',
  Inheritance = 'Inheritance',
  Realization = 'Realization',
  Dependency = 'Dependency',
  Link = 'Link'
}

export enum RelationshipElementRole {
  Client = 'Client',
  Supplier = 'Supplier',
  Whole = 'Whole',
  Part = 'Part',
  BaseClass = 'BaseClass',
  DerivedClass = 'DerivedClass',
  RelationStart = 'RelationStart',
  RelationEnd = 'RelationEnd'
}

export interface ConnectionType {
  type: RelationshipType;
  startRole: RelationshipElementRole;
  endRole: RelationshipElementRole;
}

export const ConnectionTypes: {[key: string]: ConnectionType} = {
  [RelationshipType.Association]: {
    type: RelationshipType.Association,
    startRole: RelationshipElementRole.RelationStart,
    endRole: RelationshipElementRole.RelationEnd
  },
  [RelationshipType.Aggregation]: {
    type: RelationshipType.Aggregation,
    startRole: RelationshipElementRole.Whole,
    endRole: RelationshipElementRole.Part
  },
  [RelationshipType.Composite]: {
    type: RelationshipType.Composite,
    startRole: RelationshipElementRole.Whole,
    endRole: RelationshipElementRole.Part
  },
  [RelationshipType.Inheritance]: {
    type: RelationshipType.Inheritance,
    startRole: RelationshipElementRole.BaseClass,
    endRole: RelationshipElementRole.DerivedClass
  },
  [RelationshipType.Realization]: {
    type: RelationshipType.Realization,
    startRole: RelationshipElementRole.Supplier,
    endRole: RelationshipElementRole.Client
  },
  [RelationshipType.Dependency]: {
    type: RelationshipType.Dependency,
    startRole: RelationshipElementRole.Supplier,
    endRole: RelationshipElementRole.Client
  }
};

export const relationshipTypesOfComposition: RelationshipType[] =
  [ RelationshipType.Association, RelationshipType.Aggregation, RelationshipType.Composite ];

export const relationshipTypesOfDependency: RelationshipType[] = [ RelationshipType.Dependency ];

export class LogicalConnection {
  connectionType: ConnectionType;
  endOfArchPonent: ArchNgPonent;
  endOfPonentType: NgPonentType;

  constructor(relationshipType: RelationshipType, endOfPonent: ArchNgPonent) {
    this.connectionType = ConnectionTypes[relationshipType];
    this.endOfArchPonent = endOfPonent;
    this.endOfPonentType = endOfPonent.ngPonentType;
  }
}
