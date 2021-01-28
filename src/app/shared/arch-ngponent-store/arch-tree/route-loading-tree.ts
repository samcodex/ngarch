import { AnalysisElementType } from '@core/models/analysis-element';
import { ArchNgPonentComponent } from '@core/arch-ngponent/arch-ngponent-component';
import { ArchStoreData } from '../models/arch-store-data';
import { EnhancedStoreData } from '../helpers/enhanced-store-data';
import { ArchNgPonentModule, ArchPonentFeature, ArchNgPonent, ArchNgPonentRoutes } from '@core/arch-ngponent';
import { archNgPonentHelper } from '@core/arch-ngponent/arch-ngponent-helper';
import { TsPonent, NgPonentType } from '@core/ngponent-tsponent';
import { ArchTreeType } from '@core/arch-tree/arch-tree-definition';
import { ArchTree, ArchNode } from '@core/arch-tree/arch-tree';
import { ArchNgPonentRoute } from '@core/arch-ngponent/arch-ngponent-route';
import { RelationshipType } from '@core/arch-relationship/relationship-definition';

const callExpressions = {
  [ ArchPonentFeature.RouterModuleForRoot ]: 'RouterModule.forRoot',
  [ ArchPonentFeature.RouterModuleForChild ]: 'RouterModule.forChild',
};
const includeRouteNode = true;

export function buildRouteLoadingTree(archStore: ArchStoreData, projectName: string): ArchTree {
  const storeDataHelper = new EnhancedStoreData(archStore);

  // tree
  const treeType = ArchTreeType.RouteLoadingTree;
  const tree = new ArchTree('Route Loading Tree', treeType);

  // 1. root ArchPonent - ArchNgPonentModule, appModule level
  const rootPonent: ArchNgPonentModule = archStore.getBootstrapModule();
  const root = tree.createRootNode<ArchNgPonentModule>(rootPonent);
  appendNodeRelatedProvider(root);

  const bootstrappedComponents = archNgPonentHelper.getBootstrappedComponents(rootPonent);
  const bootstrappedNodes: ArchNode<ArchNgPonentComponent>[] = bootstrappedComponents.map((bootstrapComponent) => {
    const bootstrapNode = root.appendChildNgPonent(bootstrapComponent);
    bootstrapNode.appendRelatedArchNgPonent(AnalysisElementType._From, rootPonent, 'bootstrap');

    appendNodeOfSubComponent(bootstrapNode);

    return bootstrapNode;
  });

  // parseFromNgModule(root, ArchPonentFeature.RouterModuleForRoot);
  bootstrappedNodes.forEach(bootstrappedNode => {
    parseFromNgModule(null, root, ArchPonentFeature.RouterModuleForRoot);
  });

  return tree;

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
  function parseFromNgModule(expectStartNode: ArchNode<ArchNgPonent>, startNode: ArchNode<ArchNgPonentModule>,
      routerFeature: ArchPonentFeature = ArchPonentFeature.RouterModuleForChild) {

    const startPonent: ArchNgPonentModule = startNode.archNgPonent;
    const isFeatureForRoot = routerFeature === ArchPonentFeature.RouterModuleForRoot;
    const isRouterPonent = startPonent.hasNgFeature(routerFeature);
    const findRouterInGivenModule = isFeatureForRoot
      ? storeDataHelper.findRouterForRootInGivenModule.bind(storeDataHelper)
      : storeDataHelper.findRouterForChildInGivenModule.bind(storeDataHelper);

    // create routerNode
    let routerPonent: ArchNgPonentModule, routerNode: ArchNode<ArchNgPonentModule>;
    if (isRouterPonent) {
      routerPonent = startPonent;
      routerNode = startNode;
    } else {
      const appendChild = (childArchModule: ArchNgPonentModule) => {
        const parentNode = (expectStartNode || startNode);
        const childNode = parentNode.appendChildNgPonent(childArchModule);
        childNode.appendRelatedArchNgPonent(AnalysisElementType._From, parentNode.archNgPonent, 'import');

        appendNodeRelatedProvider(childNode);
        return childNode;
      };

      routerPonent = findRouterInGivenModule(startPonent);
      routerNode = routerPonent ? appendChild(routerPonent) : null;
    }

    // create routesNode
    if (routerNode) {
      const routesNode: ArchNode<ArchNgPonentRoutes> = convertRouterNodeToRoutesNode(routerNode, routerFeature);
      const routesPonent = routesNode ? routesNode.archNgPonent : null;
      if (routesPonent && routesPonent instanceof ArchNgPonentRoutes && routesPonent.children) {
        // create routeNode
        routesPonent.children.forEach(convertRoutePonentToNode(routesNode));
      }
    }
  }

  // routerNode - ArchNgPonentModule contains Router.forRoot or Router.forChild
  function convertRouterNodeToRoutesNode(routerNode: ArchNode<ArchNgPonentModule>,
      routerFeature: ArchPonentFeature): ArchNode<ArchNgPonentRoutes> {
    const callExpression = callExpressions[routerFeature];
    const routesTsPonent = archNgPonentHelper.findCallExpressionPonent(routerNode.archNgPonent, callExpression);
    const routerExpressionPonent = archNgPonentHelper.findIdentifierExpressionPonent(routesTsPonent);
    const routesPonent = findRoutesConfiguration(routerExpressionPonent) as ArchNgPonentRoutes;

    let routesNode = null;
    if (routesPonent) {
      const nodeName = routesPonent.name;
      // if (nodeName === 'routes') {
      //   const parent = routerNode.archNgPonent;
      //   nodeName = parent.name;
      // }
      routesNode = routerNode.appendChildNgPonent<ArchNgPonentRoutes>(routesPonent, nodeName);
      routesNode.appendRelatedArchNgPonent(AnalysisElementType._From, routerNode.archNgPonent, callExpression);
    } else {
      console.error('Cannot be "null"', routerExpressionPonent);
    }

    return routesNode;
  }

  function convertRoutePonentToNode(routesNode: ArchNode<ArchNgPonentRoutes>) {
    return function(routePonent: ArchNgPonentRoute) {
      // 5. Route loadChildren - Lazy loading ArchNgPonentModule
      const routeRelatedPonent: ArchNgPonentModule | ArchNgPonentComponent = findSpecificPonentInRoutePonent(routePonent);

      let routeNode: ArchNode<ArchNgPonentRoute>;
      if (includeRouteNode || !routeRelatedPonent) {
        routeNode = routesNode.appendChildNgPonent<ArchNgPonentRoute>(routePonent, 'route', true);
        routeNode.appendRelatedArchNgPonent(AnalysisElementType._From, routesNode.archNgPonent, 'Route');
      }

      if (routeRelatedPonent) {
        const from = routeRelatedPonent.ngPonentType === NgPonentType.NgModule ? 'loadChildren (lazy-loading)' : 'component';
        let relatedPonentNode: ArchNode;
        if (!includeRouteNode) {
          relatedPonentNode = routesNode.appendChildNgPonent(routeRelatedPonent);
          relatedPonentNode.appendRelatedArchNgPonent(AnalysisElementType._From, routesNode.archNgPonent, from);
        } else {
          relatedPonentNode = routeNode.appendChildNgPonent(routeRelatedPonent);
          relatedPonentNode.appendRelatedArchNgPonent(AnalysisElementType._From, routeNode.archNgPonent, from);
        }

        appendNodeRelatedProvider(relatedPonentNode);

        if (routeNode) {
          relatedPonentNode.appendRelatedArchNgPonent(AnalysisElementType.Route, routeNode.archNgPonent);
          const from2 = relatedPonentNode.archPonentType === NgPonentType.NgModule ? 'loadChildren (lazy-loading)' : 'component';
          relatedPonentNode.appendRelatedArchNgPonent(AnalysisElementType._From, routeNode.archNgPonent, from2);
        }

        if (routeRelatedPonent instanceof ArchNgPonentModule) {
          parseFromNgModule(null, relatedPonentNode);
        }

        if (routeRelatedPonent instanceof ArchNgPonentComponent) {
          if (routePonent.hasSubRoutes) {
            const subRoutes = routePonent.subRoutes;
            const subRoutesNode = relatedPonentNode.appendChildNgPonent(subRoutes);
            subRoutesNode.appendRelatedArchNgPonent(AnalysisElementType._From, routePonent, 'route.component');

            subRoutes.children.forEach(convertRoutePonentToNode(subRoutesNode));
          }

          appendNodeOfSubComponent(relatedPonentNode);
        }
      }
    };
  }

  function findRoutesConfiguration(tsPonent: TsPonent): ArchNgPonent {
    const idFile = tsPonent.identifierFile || tsPonent.fileName;
    const value = tsPonent.value;
    const result = archStore.tryFindArchRoutePonentByName(value, idFile);
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

function appendNodeRelatedProvider(node: ArchNode) {
  const archPonent: ArchNgPonent = node.archNgPonent;
  const providers = archPonent.getProvidersOfInjector();
  if (providers) {
    providers.forEach(provider => {
      node.appendRelatedArchNgPonent(AnalysisElementType._Provider, provider);
    });
  }
}

function appendNodeOfSubComponent(node: ArchNode<ArchNgPonentComponent>) {
  const archComponent = node.archNgPonent;
  const templateComponents = archComponent.getDependenciesOfTemplate();
  if (templateComponents) {
    templateComponents.forEach(subArchPonent => {
      const subNode = node.appendChildNgPonent(subArchPonent);
      subNode.appendRelatedArchNgPonent(AnalysisElementType._From, node.archNgPonent, '<template>');

      appendNodeOfSubComponent(subNode);
    });
  }
}
