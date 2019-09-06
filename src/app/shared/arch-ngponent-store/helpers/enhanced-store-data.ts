import { ArchNgPonentModule, ArchPonentFeature } from '@core/arch-ngponent';
import { TsPonent} from '@core/ngponent-tsponent';
import { PonentTable } from '../resolver/ponent-table';
import { ArchStoreData } from '../models/arch-store-data';

export class EnhancedStoreData {
  private checkedTable = new PonentTable('Cached');

  constructor(protected archStore: ArchStoreData) { }

  findRouterForRootInGivenModule(archPonent: ArchNgPonentModule): ArchNgPonentModule {
    let foundRouteArchModule: ArchNgPonentModule = null;
    const checkRouterFn = (ponent: ArchNgPonentModule) => {
      if (ponent.hasNgFeature(ArchPonentFeature.RouterModuleForRoot)) {
        foundRouteArchModule = ponent;
      }
      return !foundRouteArchModule;   // true - continue looping, false - break looping
    };

    this.traverseNgModuleImportsWithCache(archPonent, checkRouterFn);

    return foundRouteArchModule;
  }

  findRouterForChildInGivenModule(archPonent: ArchNgPonentModule): ArchNgPonentModule {
    let foundRouteArchModule: ArchNgPonentModule = null;
    const checkRouterFn = (ponent: ArchNgPonentModule) => {
      if (ponent.hasNgFeature(ArchPonentFeature.RouterModuleForChild)) {
        foundRouteArchModule = ponent;
      }
      return !foundRouteArchModule;   // true - continue looping, false - break looping
    };

    this.traverseNgModuleImportsWithCache(archPonent, checkRouterFn);

    return foundRouteArchModule;
  }

  traverseNgModuleImportsWithCache(ngPonent: ArchNgPonentModule,
      callback: Function, forNgModule = true, canBreak = true) {

    const wrapFnWithPonentTable = (fn: Function, canBreak2: boolean) => {
      return (ngImport: (ArchNgPonentModule | TsPonent)) => {
        if (this.checkedTable.notExist(ngImport)) {
          this.checkedTable.add(ngImport);
          const returned = fn(ngImport);
          return !canBreak2 || returned;  // true - continue looping, false - break looping
        }

        return true;      // true - continue looping
      };
    };
    const callback2 = wrapFnWithPonentTable(callback, canBreak);

    this.archStore.traverseNgModuleThroughImports(ngPonent, callback2, forNgModule, canBreak);
  }
}
