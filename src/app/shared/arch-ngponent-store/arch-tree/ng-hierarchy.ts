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

const mapOfRouterExpressions = {
  [ ArchPonentFeature.RouterModuleForRoot ]: 'RouterModule.forRoot',
  [ ArchPonentFeature.RouterModuleForChild ]: 'RouterModule.forChild',
};

const mapOfFrom = {
  'Component': '<router-outlet>',
  'NgModule': 'lazy-loading'
};

export enum NgHierarchyTraverseType {
  ComponentPath = 'ComponentPath',
  RoutingPath = 'RoutingPath',
  RoutingComponentPath = 'RoutingComponentPath'
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
    this.pathType = pathType;
  }

  get isRelatedComponent(): boolean {
    const paths: NgHierarchyTraverseType[] = [
      NgHierarchyTraverseType.ComponentPath,
      NgHierarchyTraverseType.RoutingComponentPath
    ];

    // return true;
    return paths.includes(this.pathType);
  }

  get isRelatedRouting(): boolean {
    const paths = [
      NgHierarchyTraverseType.RoutingPath,
      NgHierarchyTraverseType.RoutingComponentPath
    ];

    return paths.includes(this.pathType);
  }

  buildArchTree(): ArchTree {
    this.traverseBootstrappedModule();
    return this.archTree;
  }

  private traverseBootstrappedModule() {
    // ***bootstrapped module, appModule
    const rootArchModule: ArchNgPonentModule = this.archStore.getBootstrapModule();
    const rootNode = this.archTree.createRootNode(rootArchModule);

    let refNode = rootNode;
    if (this.isRelatedComponent) {
      // ***bootstrapped component and its node
      const bootstrappedComponentNodes = this.traverseBootstrappedComponent(rootNode);

      // TODO, uses the first bootstrapped component,
      // it must be replaced with the logic of 'outlet' & 'outlets'
      refNode = bootstrappedComponentNodes[0];
    }
    if (this.isRelatedRouting) {
      refNode = rootNode;
    }

    // ***traverse bootstrapped module
    this.traverseArchModule(rootArchModule, refNode, ArchPonentFeature.RouterModuleForRoot);
  }

  private traverseBootstrappedComponent(rootArchModuleNode: ArchNode<ArchNgPonentModule>): ArchNode<ArchNgPonentComponent>[] {
    const rootArchModule = rootArchModuleNode.archNgPonent;
    // ***bootstrapped component, appComponent
    const bootstrappedComponents: ArchNgPonentComponent[] = archNgPonentHelper.getBootstrappedComponents(rootArchModule);

    // ***bootstrapped component node
    const bootstrappedComponentNodes = bootstrappedComponents
      .map(bootComponent => {
        const componentNode = rootArchModuleNode.appendChildNgPonent(bootComponent);
        componentNode.appendRelatedArchNgPonent(AnalysisElementType._From, rootArchModule, 'bootstrap');

        // ***traverse bootstrapped component
        this.traverseArchComponent(bootComponent, componentNode);

        return componentNode;
      });
    return bootstrappedComponentNodes;
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
        let relatedNode = null;
        if (this.isRelatedRouting) {
          relatedNode = parentNode.appendChildNgPonent(routesPonent);
          relatedNode.appendRelatedArchNgPonent(AnalysisElementType._From, parentNode.archNgPonent, mapOfRouterExpressions[routerFeature]);
        }

        // ***traverse Routes' elements
        routesPonent.children.forEach(this.traverseRoutesPonent(routesPonent, relatedNode || parentNode, '<router-outlet/>'));
      }
    } else {
      // ***find the routing module through import's paths
      const findRoutingModuleThroughImports: (routingModule: ArchNgPonentModule) => ArchNgPonentModule =
        routerFeature === ArchPonentFeature.RouterModuleForRoot
        ? storeDataHelper.findRouterForRootInGivenModule.bind(storeDataHelper)
        : storeDataHelper.findRouterForChildInGivenModule.bind(storeDataHelper);

      const routingArchModule: ArchNgPonentModule = findRoutingModuleThroughImports(archModule);

      if (routingArchModule) {
        let nextNode: ArchNode = parentNode;
        if (this.isRelatedRouting) {
          const routingNode = nextNode = parentNode.appendChildNgPonent(routingArchModule);
          routingNode.appendRelatedArchNgPonent(AnalysisElementType._From, parentNode.archNgPonent, 'import');
        }

        this.traverseArchModule(routingArchModule, nextNode, routerFeature);
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

    const callExpression = mapOfRouterExpressions[routerFeature];
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
      let secondParentNode = parentNode;
      if (this.isRelatedRouting) {
        const routeNode = parentNode.appendChildNgPonent(routePonent, 'route', true);
        routeNode.appendRelatedArchNgPonent(AnalysisElementType._From, parentNode.archNgPonent, 'Route');
        secondParentNode = routeNode;
      }

      // Route component or loadChildren - Lazy loading ArchNgPonentModule
      const routeRelatedPonent: ArchNgPonentModule | ArchNgPonentComponent =
        routePonent.getRelatedArchPonent(this.archStore);

      if (routeRelatedPonent) {
        const routeRelatedNode = secondParentNode.appendChildNgPonent(routeRelatedPonent);
        // for displaying route.path under the node
        routeRelatedNode.appendRelatedArchNgPonent(AnalysisElementType.Route, routePonent);
        // for displaying 'from' above the node
        from = mapOfFrom[routeRelatedPonent.ngPonentType];
        routeRelatedNode.appendRelatedArchNgPonent(AnalysisElementType._From, secondParentNode.archNgPonent, from);

        if (routeRelatedPonent instanceof ArchNgPonentModule) {
          this.traverseArchModule(routeRelatedPonent, routeRelatedNode);
        } else if (routeRelatedPonent instanceof ArchNgPonentComponent) {
          if (routePonent.hasSubRoutes) {
            const subRoutes = routePonent.subRoutes;
            subRoutes.children.forEach(this.traverseRoutesPonent(subRoutes, routeRelatedNode, '<router-outlet/>'));
          }

          if (this.isRelatedComponent) {
            this.traverseArchComponent(routeRelatedPonent, routeRelatedNode);
          }
        }
      }
    };
  }

  private createRootNode(archPonent: ArchNgPonent): ArchNode {
    return this.archTree.createRootNode(archPonent);
  }
}
