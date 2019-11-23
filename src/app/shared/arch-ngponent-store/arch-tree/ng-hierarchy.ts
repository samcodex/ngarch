import { ArchNgPonentComponent } from '@core/arch-ngponent/arch-ngponent-component';
import { ArchStoreData } from '../models/arch-store-data';
import { EnhancedStoreData } from '../helpers/enhanced-store-data';
import { ArchNgPonentModule, ArchPonentFeature, ArchNgPonent, ArchNgPonentRoutes, ArchNgPonentRoute } from '@core/arch-ngponent';
import { archNgPonentHelper } from '@core/arch-ngponent/arch-ngponent-helper';
import { TsPonent, NgPonentType } from '@core/ngponent-tsponent';
import { RelationshipType } from '@core/arch-relationship/relationship-definition';
import { ArchTree, ArchNode } from '@core/arch-tree/arch-tree';
import { ArchTreeType } from '@core/arch-tree/arch-tree-definition';
import { AnalysisElementType } from '@core/models/analysis-element';

const callExpressions = {
  [ ArchPonentFeature.RouterModuleForRoot ]: 'RouterModule.forRoot',
  [ ArchPonentFeature.RouterModuleForChild ]: 'RouterModule.forChild',
};

export enum NgHierarchyTraverseType {
  ComponentPath = 'ComponentPath',
  RoutingPath = 'RoutingPath',
  ComponentRoutingPath = 'ComponentRoutingPath'
}

export class NgHierarchy {
  private storeDataHelper: EnhancedStoreData;
  private archTree: ArchTree;

  constructor(
    private archStore: ArchStoreData,
    private projectName: string,
    private pathType: NgHierarchyTraverseType,
    treeType: ArchTreeType,
    treeName?: string
  ) {
    this.storeDataHelper = new EnhancedStoreData(archStore);
    this.archTree = new ArchTree(treeName || treeType, treeType);
    this.pathType = NgHierarchyTraverseType.ComponentPath;
  }


  buildArchTree(): ArchTree {
    this.traverseBootstrappedModule();
    return this.archTree;
  }

  private traverseBootstrappedModule() {
    // ***bootstrapped module, appModule
    const rootPonent: ArchNgPonentModule = this.archStore.getBootstrapModule();
    const rootNode = this.createRootNode(rootPonent);

    // ***bootstrapped component, appComponent
    const bootstrappedComponents: ArchNgPonentComponent[] = archNgPonentHelper.getBootstrappedComponents(rootPonent);

    // TODO
    let mustChange;
    bootstrappedComponents.forEach(bootComponent => {
      const componentNode = this.appendNode(rootNode, bootComponent);

      if (!mustChange) {
        mustChange = componentNode;
      }

      // ***traverse bootstrapped component
      this.traverseArchComponent(bootComponent, componentNode);
    });

    // TODO, 'mustChange' uses the first bootstrapped component,
    // it must be replaced with the logic of 'outlet' & 'outlets'
    // ***traverse bootstrapped module
    this.traverseArchModule(rootPonent, mustChange, ArchPonentFeature.RouterModuleForRoot);
  }

  // RoutedModule(forRoot/forChild), RootingModule
  private traverseArchModule(archModule: ArchNgPonentModule, parentNode: ArchNode,
      routerFeature: ArchPonentFeature = ArchPonentFeature.RouterModuleForChild) {

    const storeDataHelper = this.storeDataHelper;
    const isRoutingModule = archModule.hasNgFeature(routerFeature);

    if (isRoutingModule) {
      // ***archModule has RouterModule.forRoot or RouterModule.forChild, continue traverse its Route[] or Routes
      const routesPonent: ArchNgPonentRoutes = this.getArchRoutesFromRoutingModule(archModule, routerFeature);

      if (routesPonent && routesPonent instanceof ArchNgPonentRoutes && routesPonent.children) {
        // nextLoopNode is parentNode or routesNode
        const nextLoopNode = this.appendNode(parentNode, routesPonent,
          [NgHierarchyTraverseType.ComponentRoutingPath, NgHierarchyTraverseType.RoutingPath]);

        // ***traverse Routes' elements
        routesPonent.children.forEach(this.traverseRoutesPonent(routesPonent, nextLoopNode, '<router-outlet/>'));
      }
    } else {
      // ***find the routing module through import's paths
      const findRoutingModuleThroughImports: (routingModule: ArchNgPonentModule) => ArchNgPonentModule =
        routerFeature === ArchPonentFeature.RouterModuleForRoot
        ? storeDataHelper.findRouterForRootInGivenModule.bind(storeDataHelper)
        : storeDataHelper.findRouterForChildInGivenModule.bind(storeDataHelper);

      const routerPonent: ArchNgPonentModule = findRoutingModuleThroughImports(archModule);

      if (routerPonent) {
        this.traverseArchModule(routerPonent, parentNode, routerFeature);
      }
    }
  }

  // ***traverse ArchComponent, through the selectors in the template
  private traverseArchComponent(archComponent: ArchNgPonentComponent, parentNode: ArchNode) {
    if (archComponent.hasDownConnection) {
      const connections = archComponent.archRelationship ? archComponent.archRelationship.downConnections : null;
      if (connections) {
        connections
          .filter(connection => connection.endOfPonentType === NgPonentType.Component
              && connection.connectionType.type === RelationshipType.Dependency)
          .forEach((connection) => {
            const subArchPonent = connection.endOfArchPonent;

            const subNode = parentNode.appendChildNgPonent(subArchPonent);
            subNode.appendRelatedArchNgPonent(AnalysisElementType._From, parentNode.archNgPonent, '<template>');

            this.traverseArchComponent(subArchPonent, subNode);
          });
      }
    }
  }

  // routing module contains Router.forRoot or Router.forChild
  // ***get ArchRoutes
  private getArchRoutesFromRoutingModule(routingModule: ArchNgPonentModule,
      routerFeature: ArchPonentFeature): ArchNgPonentRoutes {

    const findRoutesConfiguration = (tsPonent: TsPonent): ArchNgPonent => {
      const idFile = tsPonent.identifierFile || tsPonent.fileName;
      const value = tsPonent.value;
      const result = this.archStore.tryFindArchRoutePonentByName(value, idFile);
      return result;
    };

    const callExpression = callExpressions[routerFeature];
    const routesTsPonent = archNgPonentHelper.findCallExpressionPonent(routingModule, callExpression);
    const routerExpressionPonent = archNgPonentHelper.findIdentifierExpressionPonent(routesTsPonent);
    const routesPonent = findRoutesConfiguration(routerExpressionPonent) as ArchNgPonentRoutes;

    if (!routesPonent) {
      console.error('Cannot be "null"', routerExpressionPonent);
    }

    return routesPonent;
  }

  // ***traverse the element(component or loadChildren) of Routes
  private traverseRoutesPonent(archRoutes: ArchNgPonentRoutes, parentNode: ArchNode, from: string) {
    return (routePonent: ArchNgPonentRoute) => {
      // Route component or loadChildren - Lazy loading ArchNgPonentModule
      const routeRelatedPonent: ArchNgPonentModule | ArchNgPonentComponent =
        routePonent.getRelatedArchPonent(this.archStore);

      if (routeRelatedPonent) {
        const routeRelatedNode = this.appendNode(parentNode, routeRelatedPonent);

        // for displaying route.path under the node
        routeRelatedNode.appendRelatedArchNgPonent(AnalysisElementType.Route, routePonent);

        // for displaying 'from' above the node
        routeRelatedNode.appendRelatedArchNgPonent(AnalysisElementType._From, parentNode.archNgPonent, from);

        if (routeRelatedPonent instanceof ArchNgPonentModule) {
          this.traverseArchModule(routeRelatedPonent, routeRelatedNode);
        } else if (routeRelatedPonent instanceof ArchNgPonentComponent) {
          if (routePonent.hasSubRoutes) {
            const subRoutes = routePonent.subRoutes;
            subRoutes.children.forEach(this.traverseRoutesPonent(subRoutes, routeRelatedNode, '<router-outlet/>'));
          }

          this.traverseArchComponent(routeRelatedPonent, routeRelatedNode);
        }
      }
    };
  }

  private createRootNode(archPonent: ArchNgPonent): ArchNode {
    return this.archTree.createRootNode(archPonent);
  }

  private appendNode(parent: ArchNode, archPonent: ArchNgPonent, condition?: NgHierarchyTraverseType[]): ArchNode {
    return this.pathType && condition && !condition.includes(this.pathType)
      ? parent : parent.appendChildNgPonent(archPonent);
  }
}
