import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, zip } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { ArchEndPoints } from '../../config/arch-end-points';
import { ArchNgPonent, ArchNgPonentInjectable } from '@core/arch-ngponent';
import { ModuleTypeNgPonent } from '@core/arch-ngponent/arch-ngponent-config';
import { RelationshipType, relationshipTypesOfComposition, relationshipTypesOfDependency } from '@core/arch-relationship/relationship-definition';
import { convertJsonToPonent } from '@core/ngponent-tsponent';
import { Pausable } from '@core/pausable';
import { ReloadRegisterService } from '../reloadable/reload-register.service';
import { IReloadable } from '../reloadable/reloadable.interface';
import { RestService } from '../services/rest/rest.service';
import { ArchNgPonentRoutes } from '@core/arch-ngponent/arch-ngponent-routes';
import { ArchNgPonentLoadingGroup } from './models/arch-loading-group';
import { ArchStoreData } from './models/arch-store-data';
import { ArchTree } from '@core/arch-tree/arch-tree';
import { getRouteArchPonentsWithRootModuleId } from './helpers/store-routes-helper';
import { ProjectProfileService } from '@shared/project-profile/project-profile.service';
import { isInvalidProjectConfig } from '@shared/project-profile';
import { ArchTreeType } from '@core/arch-tree/arch-tree-definition';

/**
 * Definitions:
 * 1. ArchPonent, Ponent and ArchNgPonent are the same in the ArchStoreData level,
 * 2. ImportedPonent - The ponents are imported in the typescript file,
 * including the ponents are not imported by Angular element.
 * 3. UsedPonent - The ponents are imported by Angular element.
 *
 * ArchStoreData category:
 * 1. getImportedPonentsGroupByLoadingModule - return ImportedPonents group by loading group.
 * 2. getUsedPonentsGroupByLoadingModule - return UsedPonents group by loading group.
 */

@Injectable({
  providedIn: 'root'
})
export class ArchNgPonentStore extends Pausable<ArchStoreData> implements IReloadable {

  private storeData = new ArchStoreData();
  private storeDataSubject = new ReplaySubject<ArchStoreData>(1);

  constructor(
    private rest: RestService,
    private reloadRegister: ReloadRegisterService,
    private profileService: ProjectProfileService
  ) {
    super(1);

    this.reloadRegister.register(this);

    this.initialize(this.storeDataSubject.asObservable(), true);

    this.setupPonentStoreStream();
  }


  private setupPonentStoreStream() {
    const ngArchSource = this.rest.getWithReloader(ArchEndPoints.ngArch, true, true)
      .pipe(map(convertJsonToPonent));
    const projectNameSource = this.profileService.getProjectName();

    // zip is very good, should not change to others, combineLatest, mergeMap
    zip(projectNameSource, ngArchSource )
      .subscribe(([projectName, data ]) => {
        this.storeData.updateStoreData(data, projectName);
        this.storeDataSubject.next(this.storeData);
        this.resume();
      });
  }

  getStoreData(): Observable<ArchStoreData> {
    return this.source;
    // return this.storeDataSubject.asObservable();
  }

  getValidStoreData(): Observable<ArchStoreData> {
    return this.getStoreData()
      .pipe(
        filter(storeData => !storeData.isEmpty)
      );
  }

  public reload() {
    this.pause();
    this.storeData.cleanStoreData();
  }

  // store data
  findPonentsByFileName(fileName: string): Observable<ArchNgPonent[]> {
    return this.getValidStoreData().pipe(
      map( storeData => storeData.findPonentByFileName(fileName))
    );
  }

  findPonentByName(name: string, fileName: string): Observable<ArchNgPonent> {
    return this.getValidStoreData().pipe(
      map( storeData => storeData.findPonentByName(name, fileName))
    );
  }

  findCompositionPonents(name: string): Observable<ArchNgPonent[]> {
    return this.findPonentAndSpecificDependencies(name, relationshipTypesOfComposition);
  }

  findDependencyPonents(name: string): Observable<ArchNgPonent[]> {
    return this.findPonentAndSpecificDependencies(name, relationshipTypesOfDependency);
  }

  findPonentAndSpecificDependencies(name: string, relationshipType: RelationshipType[]): Observable<ArchNgPonent[]> {
    return this.getValidStoreData().pipe(
      map( storeData => storeData.findPonentAndSpecificDependencies(name, relationshipType))
    );
  }

  findPonentAndDependenciesByName(name: string, isDirectedDependencies: boolean = true): Observable<ArchNgPonent[]> {
    return this.getValidStoreData().pipe(
      map( storeData => storeData.findPonentAndDependenciesByName(name, isDirectedDependencies))
    );
  }

  // loading group
  getAllImportedPonentsGroupByLoadingModule(): Observable<ArchNgPonentLoadingGroup[]>  {
    return this.getValidStoreData().pipe(map(
      storeData => storeData.getImportedPonentsFromLoadingGroup()));
  }

  getUsedPonentsGroupByLoadingModule(): Observable<ArchNgPonentLoadingGroup[]>  {
    return this.getValidStoreData().pipe(map(
      storeData => storeData.getImportedPonentsFromLoadingGroup()
        .map(ArchNgPonentLoadingGroup.createUsedPonentsOfLoadingGroup)
    ));
  }

  getUnusedPonentsGroupByLoadingModule(): Observable<ArchNgPonentLoadingGroup[]>  {
    return this.getValidStoreData().pipe(map(
      storeData => storeData.getImportedPonentsFromLoadingGroup()
        .map(ArchNgPonentLoadingGroup.createIsolatedPonentsOfLoadingGroup)
    ));
  }

  getRootModulesOfLoadingGroup() {
    return this.getValidStoreData().pipe(map(storeData => storeData.getRootModulesOfLoadingGroup()));
  }

  getAllPonentsByLoadingGroupName(groupName: string): Observable<ArchNgPonent[]>  {
    return this.getValidStoreData().pipe(map( storeData => storeData.getAllPonentsByLoadingGroupName(groupName)));
  }

  // module type ponents
  getAllDataFromModuleTypePonents(): Observable<ModuleTypeNgPonent[]> {
    return this.getValidStoreData().pipe(map(storeData => storeData.getAllDataFromModuleTypePonents()));
  }

  getAllServicesFromModuleTypePonents(): Observable<ArchNgPonentInjectable[]>  {
    return this.getValidStoreData().pipe(map( storeData => storeData.getAllServicesFromModuleTypePonents()));
  }

  // getModuleTypePonentByName(ponentName: string): Observable<ArchNgPonent>  {
  //   return this.getValidStoreData().map( storeData => storeData.getModuleTypePonentByName(ponentName));
  // }


  // model ponents
  getAllModels(): Observable<ArchNgPonent[]>  {
    return this.getValidStoreData().pipe(map( storeData => storeData.modelTypePonents.data));
  }

  // routeData
  getRouteData(): Observable<ArchNgPonentRoutes[]> {
    return this.getValidStoreData().pipe(map( storeData => storeData.routeTypePonents));
  }

  getRouteArchPonentsWithRootModuleId(moduleId: string): Observable<ArchNgPonentRoutes[]> {
    return this.getValidStoreData()
      .pipe(
        map( storeData => getRouteArchPonentsWithRootModuleId(this.storeData, moduleId))
      );
  }

  // ArchTree
  getArchTreeByType(treeType: ArchTreeType): Observable<ArchTree> {
    return this.getValidStoreData().pipe(map( storeData => storeData.getArchTree(treeType)));
  }
}
