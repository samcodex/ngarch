import { ArchNgPonentComponent } from '@core/arch-ngponent/arch-ngponent-component';
import { ArchStoreData } from '../models/arch-store-data';
import { EnhancedStoreData } from '../helpers/enhanced-store-data';
import { ArchNgPonentModule, ArchPonentFeature, ArchNgPonent, ArchNgPonentRoutes, ArchNgPonentRoute, isArchModule } from '@core/arch-ngponent';
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
  'Component': 'component',
  'NgModule': 'loadChildren (lazy-loading)'
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
    private treeType: ArchTreeType,
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
    this.appendNodeServiceTypeContentAndTree(rootNode);

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
        this.appendNodeServiceTypeContentAndTree(componentNode);

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
          this.appendNodeServiceTypeContentAndTree(routingNode);
          routingNode.appendRelatedArchNgPonent(AnalysisElementType._From, parentNode.archNgPonent, 'import');
        }

        this.traverseArchModule(routingArchModule, nextNode, routerFeature);
      }
    }
  }

  // ***traverse ArchComponent, through the selectors in the template
  private traverseArchComponent(archComponent: ArchNgPonentComponent, parentNode: ArchNode) {
    const templateComponents = archComponent.getDependenciesOfTemplate();
    if (templateComponents) {
      templateComponents.forEach(subArchPonent => {
        const subNode = parentNode.appendChildNgPonent(subArchPonent);
        subNode.appendRelatedArchNgPonent(AnalysisElementType._From, parentNode.archNgPonent, '<template>');

        this.traverseArchComponent(subArchPonent, subNode);
      });
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
        this.appendNodeServiceTypeContentAndTree(routeRelatedNode);

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

  // service type content - with AnalysisElementType._Provider, for displaying Providers in node detail style
  // service type tree - with ArchTreeType.InjectorAndDependencyTree,
  //                    for Injector Hierarchy, Provider Hierarchy, Dependency Diagram
  private appendNodeServiceTypeContentAndTree(node: ArchNode) {
    const appendNodeFn = (this.treeType === ArchTreeType.InjectorAndDependencyTree)
      ? appendNodeServiceTypeHierarchies : appendNodeProviderContent;
    appendNodeFn(node);
  }
}

function appendNodeProviderContent(node: ArchNode) {
  const archPonent: ArchNgPonent = node.archNgPonent;
  const providers = archPonent.getProvidersOfInjector();
  if (providers) {
    providers.forEach(provider => {
      node.appendRelatedArchNgPonent(AnalysisElementType._Provider, provider);
    });
  }
}

function appendNodeServiceTypeHierarchies(node: ArchNode) {
  const archPonent: ArchNgPonent = node.archNgPonent;
  appendServiceTypeInjectorAndProviderHierarchies(node);

  if (archPonent.isComponent) {
    appendServiceTypeOfComponentDependencies(node);
  }
}

function appendServiceTypeInjectorAndProviderHierarchies(node: ArchNode) {
  const archPonent: ArchNgPonent = node.archNgPonent;
  const providers = archPonent.getProvidersOfInjector();

  let injectorNode: ArchNode = null;
  if (archPonent.isNgModule) {
    injectorNode = node.findNodeWithModuleInjector();
  } else if (providers && providers.length) {
    injectorNode = node;
  }

  if (injectorNode) {
    if (providers && providers.length) {
      providers.forEach(provider => {
        injectorNode.appendRelatedArchNgPonent(AnalysisElementType._Injector, provider);
      });
    } else {
      injectorNode.appendRelatedArchNgPonent(AnalysisElementType._Injector, null);
    }
  }
}

function appendServiceTypeOfComponentDependencies(node: ArchNode<ArchNgPonentComponent>) {
  const archPonent: ArchNgPonentComponent = node.archNgPonent;
  const dependenciesOfCtor = archPonent.getDependenciesOfCtorInjectable();
  if (dependenciesOfCtor) {
    dependenciesOfCtor.forEach(dependency => {
      node.appendRelatedArchNgPonent(AnalysisElementType._Dependency, dependency);
    });
  }
}
