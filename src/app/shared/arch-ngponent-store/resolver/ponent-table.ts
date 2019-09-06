import {NgPonentId, NgPonentIdentifier} from '@core/ngponent-tsponent/ngponent-identity';

export class PonentTable {
  ponentIds: Set<NgPonentId> = new Set();

  constructor(private name: string) {

  }

  add(id: any) {
    id = this.toId(id);
    if (!this.ponentIds.has(id)) {
      this.ponentIds.add(id);
    }
  }

  delete(id: NgPonentId) {
    this.ponentIds.delete(id);
  }

  has(id: NgPonentId): boolean {
    id = this.toId(id);
    return this.ponentIds.has(id);
  }

  notExist(id: any): boolean {
    return !this.has(id);
  }

  toId(id: any): NgPonentIdentifier {
    return !NgPonentIdentifier.isTypePonentId(id)
      ? NgPonentIdentifier.createPonentIdentify(id) : id;
  }
}
