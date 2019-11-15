import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ArchNgPonentStore } from '@shared/arch-ngponent-store';
import { RelationshipType } from '@core/arch-relationship';
import { ArchNgPonent } from '@core/arch-ngponent';
import { ArchViewerOptionsService } from '../viewers/app-arch-viewer/services/arch-viewer-options.service';
import { ArchTree } from '@core/arch-tree/arch-tree';
import { mergeMap, map } from 'rxjs/operators';
import { mapViewerHierarchyToArchTree } from '../viewers/config/arch-viewer-definition';
import { ArchTreeType } from '@core/arch-tree/arch-tree-definition';

@Injectable({
  providedIn: 'root'
})
export class AppViewerDataService {

  constructor(
    private store: ArchNgPonentStore,
    private optionsService: ArchViewerOptionsService
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

  getViewerDataByHierarchyOption(): Observable<ArchTree> {
    return this.optionsService.getViewerHierarchy()
      .pipe(
        map(mapViewerHierarchyToArchTree),
        mergeMap(this.store.getArchTree.bind(this.store))
      );
  }

  getStructureTree() {
    return this.store.getArchTree(ArchTreeType.ModuleStructureTree);
  }
}
