import { EnhancedStoreData } from './enhanced-store-data';
import { ArchNgPonentModule, ArchNgPonentRoutes } from '@core/arch-ngponent';
import { TsPonent, TsPonentType, PonentHelper } from '@core/ngponent-tsponent';
import { ArchStoreData } from '../models/arch-store-data';

export function getRouteArchPonentsWithRootModuleId(archStore: ArchStoreData, moduleId: string): ArchNgPonentRoutes[] {
  const enhancedStore = new EnhancedStoreData(archStore);

  let routeArchPonents: ArchNgPonentRoutes[] = null;
  const rootArchPonent: ArchNgPonentModule = archStore.tryFindModulePonentByName(moduleId) as ArchNgPonentModule;

  if (rootArchPonent) {
    const routerPonents: TsPonent[] = collectRouterModuleTsPonent(rootArchPonent);
    const routePonents = filterRouterModulePropertyTsPonents(routerPonents);
    if (routePonents && routePonents.length) {
      routeArchPonents = routePonents
        .map(route => archStore.tryFindArchRoutePonentByName(route.value, route.fileName));
    }
  }

  return routeArchPonents;

  function filterRouterModulePropertyTsPonents(routerPonents: TsPonent[]): TsPonent[] {
    const routePonents = [];
    const routesType = [ TsPonentType.IdentifierExpressionPonent ];
    routerPonents.forEach(routerPonent => {
      const routes = PonentHelper.filterTsPonentMembersByType(routerPonent, routesType);
      routePonents.push.apply(routePonents, routes);
    });

    return routePonents;
  }

  function collectRouterModuleTsPonent(ngPonent: ArchNgPonentModule): TsPonent[] {
    const routerPonent = [];
    const collectRouterPonents = (imported: TsPonent) => {
      if (imported.ponentType === TsPonentType.CallExpressionPonent && imported.name.startsWith('RouterModule')) {
        routerPonent.push(imported);
      }
    };

    enhancedStore.traverseNgModuleImportsWithCache(ngPonent, collectRouterPonents, false);

    return routerPonent;
  }

}
