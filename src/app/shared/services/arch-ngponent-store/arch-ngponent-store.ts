import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { forOwn, isFunction } from 'lodash';

import { ArrayObject } from './../../../core/ArrayObject';
import { PonentLoaderService } from './../ponent-loader/ponent-loader.service';
import { Ponent, NgPonent, TsPonent, NgPonentType, PonentsRelation,
  PonentTypesWithServiceDependencies,
  TsPonentType} from '../../../core/ngponent-tsponent';
import { NgPonentFeature } from './../../../core/ngponent-tsponent/ngponent-definition';
import {ArchNgPonentLoadingGroup, LoadingGroups} from './arch-ngponent-store-definition';
import { ArchNgPonent, ArchNgPonentModule, ArchNgPonentComponent, ArchNgPonentDirective,
  ArchNgPonentInjectable, ModuleTypeNgPonent, ArchNgPonentClassMapping } from '../../../core/arch-ngponent';
import { ReloadRegisterService } from '../../reloadable/reload-register.service';
import { IReloadable } from '../../reloadable/reloadable.interface';


const archClassKeys = Object.keys(ArchNgPonentClassMapping);


@Injectable()
export class ArchNgPonentStore implements IReloadable {
  // private _raw: Array<Ponent>;
  private data: ArchNgPonent[] = [];
  private dataSubject: ReplaySubject<Array<ArchNgPonent>>;

  // bootstrap module
  private bootstrapModule: ArchNgPonentModule = null;

  // lazy loading modules
  private lazyLoadingModules: ArrayObject<ArchNgPonentModule> = new ArrayObject();

  /**
   * group the data of ArchNgPonentLoadingGroup by the name of the lazy loading module
   * ArchNgPonentLoadingGroup - all ArchNgPonent data(array) group by the lazy loading module
   *
   * @private
   * @type {LoadingGroups}
   * @memberof ArchNgPonentStore
   * @see ArchNgPonentLoadingGroup
   */
  private loadingGroups: LoadingGroups = {};

  // NgModule/Component/Directive/Injectable/Pipe
  private moduleTypePonents: ArrayObject<ModuleTypeNgPonent> = new ArrayObject();

  // route data ngponents
  private routeData: ArchNgPonent[] = [];

  // model ngponents
  private modelPonents: ArrayObject<ArchNgPonent> = new ArrayObject();


  constructor(
    private loader: PonentLoaderService,
    private reloadRegister: ReloadRegisterService,
  ) {
    this.reloadRegister.register(this);

    this.init();

    this.dataSubject = new ReplaySubject<ArchNgPonent[]>(1);
    this.loader.getData().subscribe(this.addStoreData.bind(this));
  }

  private init() {
    this.data.length = 0;
  }

  public reload() {
    this.cleanStoreData();
  }

  getData(): Observable<ArchNgPonent[]> {
    return this.dataSubject.asObservable();
  }

  /**
   *
   * @returns {Observable<ArchNgPonentModule>} this.bootstrapModule
   * @memberof ArchNgPonentStore
   */
  getBootstrapModule(): Observable<ArchNgPonentModule> {
    return Observable.create( observer => {
      this.getData().subscribe( () => {
        observer.next(this.bootstrapModule);
      });
    });
  }

  /**
   *
   *
   * @returns {Observable<ArchNgPonentModule[]>} data of this.lazyLoadingModules
   * @memberof ArchNgPonentStore
   */
  // getLazyLoadingModules(): Observable<ArchNgPonentModule[]> {
  //   return Observable.create( observer => {
  //     this.getData().subscribe( () => {
  //       const data: ArchNgPonentModule[] = this.lazyLoadingModules.data;

  //       observer.next(data);
  //     });
  //   });
  // }

  /**
   *
   * for 1. the data of ponent-summary component
   *     2. the flow panel of ponent-diagram component
   * @param {any[]} [handler]
   * @returns {Observable<ArchNgPonentLoadingGroup[]>} array of ArchNgPonentLoadingGroup
   * @memberof ArchNgPonentStore
   */
  getPonentsGroupByLoadingModule(): Observable<ArchNgPonentLoadingGroup[]>  {
    return Observable.create( observer => {
      this.getData().subscribe( () => {

        const groups = Object.values(this.loadingGroups);
        observer.next(groups);
      });
    });
  }

  /**
   * for the data of full-structure component
   *
   * @returns {Observable<ModuleTypeNgPonent[]>} array of ModuleTypeNgPonent
   * @memberof ArchNgPonentStore
   */
  getModuleTypePonents(): Observable<ModuleTypeNgPonent[]> {
    return this.nextObservable(() => this.moduleTypePonents.data.sort(ArchNgPonent.sort));
  }

  /**
   * all ArchNgModules
   * for 1) overview of ponent-diagram component
   * @returns {Observable<ArchNgPonent[]>} array of NgModule
   * @memberof ArchNgPonentStore
   */
  getAllArchNgModules(): Observable<ArchNgPonent[]> {
    return this.nextObservable(() => {
      return this.moduleTypePonents.data
        .filter( ponent => ponent.ngPonentType === NgPonentType.NgModule)
        .sort(ArchNgPonent.sort);
    });
  }

  /**
   *
   * the data of ponent-diagram(ponent-diagram-data-service)
   * @param {string} name
   * @returns {Observable<ArchNgPonent[]>} get ArchNgPonents by the loading module
   * @memberof ArchNgPonentStore
   */
  getPonentsByLoadingModule(name: string): Observable<ArchNgPonent[]>  {
    return Observable.create( observer => {
      this.getData().subscribe(() => {
        const loadingGroups = this.loadingGroups;
        if (loadingGroups.hasOwnProperty(name)) {
          observer.next(loadingGroups[name].archNgPonents);
        }
        // observer.complete();
      });
    });
  }

  getAllServiceNgPonents(): Observable<ArchNgPonent[]>  {
    return this.nextObservable(() => this.moduleTypePonents.data.filter( ponent => ponent.ngPonentType === NgPonentType.Injectable));
  }

  getModuleTypePonentByName(name: string): Observable<ArchNgPonent[]>  {
    return this.nextObservable(() => this.moduleTypePonents.getByKey(name));
  }

  getAllModels(): Observable<ArchNgPonent[]>  {
    return this.nextObservable(() => this.modelPonents.data);
  }

  getRouteData(): Observable<ArchNgPonent[]> {
    return this.nextObservable(() => this.routeData);
  }

  // including not module-type ponents, Route
  findPonentsByFileName(fileName: string): Observable<ArchNgPonent[]> {
    const len = fileName.length;

    return this.nextObservable(() => {
      return this.data.filter( ponent => {
        const lenPonent = ponent.fileName.length;
        return ponent.fileName.substr(lenPonent - len, len) === fileName;
      });
    });
  }

  findModuleTypePonentsByFileName(fileName: string): Observable<ArchNgPonent[]> {
    const len = fileName.length;

    return this.nextObservable(() => {
      return this.moduleTypePonents.data.filter( ponent => {
        const lenPonent = ponent.fileName.length;
        return ponent.fileName.substr(lenPonent - len, len) === fileName;
      });
    });
  }

  private nextObservable<T>(dataFn: any): Observable<T> {
    return Observable.create( observer => {
      this.getData().subscribe( (d) => {
        let data: T;
        if (isFunction(dataFn)) {
          data = dataFn.call(this);
        } else {
          data = dataFn;
        }
        observer.next(data);
        // observer.complete();
      });
    });
  }

  private cleanStoreData() {
    this.data.length = 0;
    this.bootstrapModule = null;
    this.lazyLoadingModules.clear();

    this.loadingGroups = {};
    this.moduleTypePonents.clear();
    this.routeData.length = 0;
    this.modelPonents.clear();
  }

  private addStoreData(ponents: Ponent[]): void {
    this.cleanStoreData();
    // this._raw = ponents;

    // group ngponents and tsponents by ponent.name
    const groupers: PonentGroupers = createPonentGroupers(ponents);

    forOwn(groupers, (groupItems, name) => {
      groupItems.forEach(groupItem => {
        // create ArchNgPonent
        const ngponentItem = this.createArchNgPonent(groupItem);

        if (ngponentItem) {
          // update store's references
          this.updateReferences(ngponentItem);

          // update store's data
          this.data.push(ngponentItem);
        }
      });
    });

    // update store's loadingGroups
    this.updateLoadingGroups();

    // notify data updated
    this.dataSubject.next(this.data);
  }

  private createArchNgPonent(groupItem: PonentGrouper): ArchNgPonent {
    let archPonent: ArchNgPonent = null;

    if (archClassKeys.indexOf(groupItem.ponentType) > -1) {
      const clazz = ArchNgPonentClassMapping[groupItem.ponentType];
      archPonent = new clazz(groupItem.name, groupItem.ngPonent, groupItem.tsPonent);
    } else {
      console.log('Unimplemented ponent type -> ', groupItem.ponentType, groupItem.name);
    }

    return archPonent;
  }

  private updateReferences(archPonent: ArchNgPonent) {
    const ponentName = archPonent.name;

    if (archPonent.ngPonentType === NgPonentType.NgModule) {
      const features = archPonent.ngPonent.ngPonentFeatures;
      const loadingGroup = archPonent.ngPonent.loadingGroup;

      if (features && features.length > 0 && features.indexOf(NgPonentFeature.BootstrapModule) > -1) {
        this.bootstrapModule = archPonent;
        this.createLoadingGroup(archPonent, true);

      } else if (loadingGroup && loadingGroup.length > 0 && loadingGroup.indexOf(ponentName) > -1) {
        this.lazyLoadingModules.push(archPonent, archPonent.name);
        this.createLoadingGroup(archPonent, false);
      }

      this.moduleTypePonents.push(archPonent, archPonent.name);

    } else if (archPonent.ngPonentType === NgPonentType.Component) {
      this.moduleTypePonents.push(archPonent, archPonent.name);

    } else if (archPonent.ngPonentType === NgPonentType.Directive) {
      this.moduleTypePonents.push(archPonent, archPonent.name);

    } else if (archPonent.ngPonentType === NgPonentType.Injectable) {
      this.moduleTypePonents.push(archPonent, archPonent.name);

    } else if (archPonent.ngPonentType === NgPonentType.Pipe) {
      this.moduleTypePonents.push(archPonent, archPonent.name);

    } else if (archPonent.ngPonentType === NgPonentType.Model) {
      this.modelPonents.push(archPonent, archPonent.name);

    } else if (archPonent.ngPonentType === NgPonentType.Route) {
      this.routeData.push(archPonent);

    }
  }

  // This function must be called inside the subscription of this.getData();
  // private getServiceNgPonents(): ModuleTypeNgPonent[] {
  //   return this.getModuleTypePonentsByPonentType(NgPonentType.Injectable);
  // }

  // This function must be called inside the subscription of this.getData();
  // private getModuleTypePonentsByPonentType(type: NgPonentType): ModuleTypeNgPonent[] {
  //   return this.moduleTypePonents.data.filter( ponent => ponent.ngPonentType === type);
  // }

  private createLoadingGroup(archPonent: ArchNgPonent, isBootstrapGroup: boolean) {
    const ponentName = archPonent.name;

    this.loadingGroups[ponentName] = {
      ngPonentName: ponentName,
      fileName: archPonent.ngPonent.fileName,
      isBootstrapGroup: isBootstrapGroup,
      archNgPonents: []
    };
  }

  private updateLoadingGroups() {
    this.data.forEach( archPonent => {
      if (PonentsRelation.PonentTypesRelateToAngularLoading.indexOf(archPonent.ngPonentType) > -1) {
        archPonent.ngPonent.loadingGroup.forEach(groupName => {
          this.loadingGroups[groupName].archNgPonents.push(archPonent);
        });
      }
    });

    // sort
    const groups = Object.values(this.loadingGroups);
    groups.forEach(group => {
      group.archNgPonents.sort(ArchNgPonent.sort);
    });
  }
}

interface PonentGrouper {
  name: string;
  fileName: string;
  ngPonent: NgPonent;
  tsPonent: TsPonent;
  ponentType: NgPonentType;
}

interface PonentGroupers {
  ponentName: PonentGrouper[];
}

function createPonentGrouper(name, fileName,
  ngPonent = null, tsPonent = null, ponentType = null): PonentGrouper {
  return {
    name: name,
    fileName: fileName,
    ngPonent: ngPonent,
    tsPonent: tsPonent,
    ponentType: ponentType,
  };
}

function createPonentGroupers(ponents: Ponent[]): PonentGroupers {
  const groupers: PonentGroupers = <PonentGroupers>{};
  let groupItem: PonentGrouper, itemElement;

  ponents.forEach(ponent => {
    const ponentName = ponent.name;
    const ponentFileName = ponent.fileName;

    if (groupers.hasOwnProperty(ponentName)) {
      const groupItems: PonentGrouper[] = groupers[ponentName];
      itemElement = groupItems.find( gItem => gItem.fileName === ponentFileName);
      if (itemElement) {
        groupItem = itemElement;
      } else {
        groupItem = createPonentGrouper(ponentName, ponentFileName);
        groupItems.push(groupItem);
      }
    } else {
      groupItem = createPonentGrouper(ponentName, ponentFileName);
      groupers[ponentName] = [groupItem];
    }

    groupItem.ponentType = <NgPonentType>(groupItem.ponentType || ponent.ponentType);
    if (ponent.$clazz === 'NgPonent') {
      groupItem.ngPonent = <NgPonent>ponent;
    } else {
      groupItem.tsPonent = <TsPonent>ponent;
    }
  });

  return groupers;
}
