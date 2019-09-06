import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ArchNgPonentStore } from '@shared/arch-ngponent-store';
import { RelationshipType } from '@core/arch-relationship';
import { ArchNgPonent } from '@core/arch-ngponent';

@Injectable({
  providedIn: 'root'
})
export class AppViewerDataService {

  constructor(
    private store: ArchNgPonentStore
  ) { }

  getRootNgModules() {
    return this.store.getRootModulesOfLoadingGroup();
  }

  // getModuleTypePonentsForModuleView( ponentName: string ): Observable<ArchNgPonent[]> {
  //   const relationTypes = [
  //     RelationshipType.Association,
  //     RelationshipType.Aggregation,
  //     RelationshipType.Composite,
  //     RelationshipType.Dependency
  //   ];

  //   return this.store.findPonentAndSpecificDependencies(ponentName, relationTypes);
  // }

  getPonentAndDependencies(ponentName: string ): Observable<ArchNgPonent[]> {
    return this.store.findPonentAndSpecificDependencies(ponentName, [RelationshipType.Dependency]);
  }

  getRouteTree() {
    return this.store.getRouteTree();
  }

  getStructureTree() {
    return this.store.getModuleStructureTree();
  }
}
