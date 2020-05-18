import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ArchNgPonentStore } from '@shared/arch-ngponent-store';
import { RelationshipType } from '@core/arch-relationship';
import { ArchNgPonent } from '@core/arch-ngponent';
import { ArchTree } from '@core/arch-tree/arch-tree';
import { ArchTreeType } from '@core/arch-tree/arch-tree-definition';

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


  getArchTreeByType(type: ArchTreeType): Observable<ArchTree> {
    return this.store.getArchTreeByType(type);
  }

  getStructureTree() {
    return this.store.getArchTreeByType(ArchTreeType.ModuleStructureTree);
  }
}
