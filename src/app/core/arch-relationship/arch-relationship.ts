import { ArchNgPonent } from '../arch-ngponent';
import { LogicalConnection, RelationshipType } from './relationship-definition';

export class ArchRelationship {
  private _owner: ArchNgPonent;
  private _downConnections: LogicalConnection[] = [];
  private _upConnections: LogicalConnection[] = [];

  constructor(startPonent: ArchNgPonent) {
    this._owner = startPonent;
  }

  get hasDownConnection(): boolean {
    return this._downConnections.length > 0;
  }

  get hasUpConnection(): boolean {
    return this._upConnections.length > 0;
  }

  get downConnections(): LogicalConnection[] {
    return this._downConnections;
  }

  get upConnections(): LogicalConnection[] {
    return this._upConnections;
  }

  addConnection(relationshipType: RelationshipType, downPonent: ArchNgPonent) {
    this.addDownConnection(relationshipType, downPonent);

    let downPonentRelationship = downPonent.archRelationship;
    if (!downPonentRelationship) {
      downPonentRelationship = downPonent.archRelationship = new ArchRelationship(downPonent);
    }

    downPonentRelationship.addUpConnection(relationshipType, this._owner);
  }

  private addDownConnection(relationshipType: RelationshipType, downPonent: ArchNgPonent) {
    if (!findConnection(this._downConnections, relationshipType, downPonent)) {
      const connection = new LogicalConnection(relationshipType, downPonent);
      this._downConnections.push(connection);
    }
  }

  private addUpConnection(relationshipType: RelationshipType, upPonent: ArchNgPonent) {
    if (!findConnection(this._upConnections, relationshipType, upPonent)) {
      const connection = new LogicalConnection(relationshipType, upPonent);
      this._upConnections.push(connection);
    }
  }
}

function findConnection(connections: LogicalConnection[], type: RelationshipType, ponent: ArchNgPonent) {
  return connections.find( connection => connection.connectionType.type === type && connection.endOfArchPonent === ponent );
}
