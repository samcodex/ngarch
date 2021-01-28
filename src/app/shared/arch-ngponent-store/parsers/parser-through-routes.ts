import { ArchNgPonentComponent } from '@core/arch-ngponent/arch-ngponent-component';
import { ArchStoreData } from '../models/arch-store-data';
import { EnhancedStoreData } from '../helpers/enhanced-store-data';
import { ArchNgPonentModule, ArchPonentFeature, ArchNgPonent, ArchNgPonentRoutes } from '@core/arch-ngponent';
import { archNgPonentHelper } from '@core/arch-ngponent/arch-ngponent-helper';
import { TsPonent } from '@core/ngponent-tsponent';
import { ArchNgPonentRoute } from '@core/arch-ngponent/arch-ngponent-route';

const callExpressions = {
  [ ArchPonentFeature.RouterModuleForRoot ]: 'RouterModule.forRoot',
  [ ArchPonentFeature.RouterModuleForChild ]: 'RouterModule.forChild',
};

export function parseThroughRoutes(archStore: ArchStoreData,
    callback: (routeTsPonent: TsPonent) => ArchNgPonentRoutes ) {
  const storeDataHelper = new EnhancedStoreData(archStore);
  // 1. root ArchPonent - ArchNgPonentModule, appModule level
  const rootPonent: ArchNgPonentModule = archStore.getBootstrapModule();
  parseFromNgModule(rootPonent, ArchPonentFeature.RouterModuleForRoot);

  return null;

  /**
   * looping logic
   * 1. (startNode => routerNode)
   *    the startNode is a ArchNgPonentModule, it can be any NgModule. The first start node should be AppModule
   * 2. Check if the ArchNgPonentModule contains RouterModule.forRoot or RouterModule.forChild
   * 3. If yes, the ArchNgPonentModule has RouterModule and is already added to the tree
   * 4. If no, find the ArchNgPonentModule with RouterModule through imports and add it to the tree
   * 5. (routerNode => routesNode)
   *    from routerNoe, find the routes configuration
   * 6. (routesNode => routeNode)
   *    from routes configuration to each item
   * 7. (each routeNode => relatedPonent)
   *    from each route item, find routeRelatedNgModule or routeRelatedComponent
   * 8. If relatedPonent is Component, the route looping is finished.
   * 9. If relatedPonent is NgModule, loop from step 1 again this logic
   *
   * startNode => routerNode => routesNode => routeNode => relatedPonent
   */
  function parseFromNgModule(modulePonent: ArchNgPonentModule,
      routerFeature: ArchPonentFeature = ArchPonentFeature.RouterModuleForChild) {

    const isFeatureForRoot = routerFeature === ArchPonentFeature.RouterModuleForRoot;
    const isRouterPonent = modulePonent.hasNgFeature(routerFeature);
    const findRouterInGivenModule = isFeatureForRoot
      ? storeDataHelper.findRouterForRootInGivenModule.bind(storeDataHelper)
      : storeDataHelper.findRouterForChildInGivenModule.bind(storeDataHelper);

    // routingModulePonent
    const routingModulePonent: ArchNgPonentModule = isRouterPonent ? modulePonent : findRouterInGivenModule(modulePonent);
    if (routingModulePonent) {
      const routesPonent: ArchNgPonentRoutes = findRoutesPonentFromRoutingModule(routingModulePonent, routerFeature);
      if (routesPonent && routesPonent instanceof ArchNgPonentRoutes && routesPonent.children) {
        routesPonent.children.forEach(keepParseThroughRoutePonent);
      }
    }
  }

  // routerNode - ArchNgPonentModule contains Router.forRoot or Router.forChild
  function findRoutesPonentFromRoutingModule(routingModulePonent: ArchNgPonentModule,
      routerFeature: ArchPonentFeature): ArchNgPonentRoutes {
    const callExpression = callExpressions[routerFeature];
    const routesTsPonent = archNgPonentHelper.findCallExpressionPonent(routingModulePonent, callExpression);
    const routerExpressionPonent = archNgPonentHelper.findIdentifierExpressionPonent(routesTsPonent);
    let routesArchPonent: ArchNgPonentRoutes = findRoutesConfiguration(routerExpressionPonent) as ArchNgPonentRoutes;

    if (!routesArchPonent) {
      // The routes variable do not have Type 'Routes | Route[]'
      const routesVariable = findRoutesTsPonent(routerExpressionPonent);
      routesArchPonent = callback(routesVariable);
    }

    return routesArchPonent;
  }

  // keep parse through route's children, such as component & loadChildren
  function keepParseThroughRoutePonent(routePonent: ArchNgPonentRoute) {
    // 5. Route loadChildren - Lazy loading ArchNgPonentModule
    const routeRelatedPonent: ArchNgPonentModule | ArchNgPonentComponent = findSpecificPonentInRoutePonent(routePonent);

    if (routeRelatedPonent) {
      if (routeRelatedPonent instanceof ArchNgPonentModule) {
        parseFromNgModule(routeRelatedPonent);
      }

      if (routeRelatedPonent instanceof ArchNgPonentComponent) {
        if (routePonent.hasSubRoutes) {
          const subRoutes = routePonent.subRoutes;
          subRoutes.children.forEach(keepParseThroughRoutePonent);
        }
      }
    }
  }

  function findRoutesConfiguration(tsPonent: TsPonent): ArchNgPonent {
    const idFile = tsPonent.identifierFile || tsPonent.fileName;
    const value = tsPonent.value;
    const result = archStore.tryFindArchRoutePonentByName(value, idFile);
    return result;
  }

  function findRoutesTsPonent(tsPonent: TsPonent): TsPonent {
    const idFile = tsPonent.identifierFile || tsPonent.fileName;
    const value = tsPonent.value;
    const result = archStore.tryFindTsMemberByName(value, idFile);
    return result;
  }

  function findSpecificPonentInRoutePonent(routePonent: ArchNgPonentRoute): ArchNgPonentModule | ArchNgPonentComponent {
    let relatedPonent: ArchNgPonentModule | ArchNgPonentComponent = null;

    if (routePonent.hasComponent) {
      const moduleId = routePonent.getComponentModuleIdentifier();
      relatedPonent = archStore.findComponentByModuleId(moduleId);
    } else if (routePonent.hasLoadChildren) {
      const moduleId = routePonent.getLoadChildrenModuleId();
      if (moduleId) {
        relatedPonent = archStore.findPonentByModuleId(moduleId) as ArchNgPonentModule;
      } else {
        console.error('Cannot find the route\'s related ArchNgPonentModule', routePonent);
      }
    }

    return relatedPonent;
  }
}

