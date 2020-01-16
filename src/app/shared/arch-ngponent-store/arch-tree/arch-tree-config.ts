import { ArchTreeType } from '@core/arch-tree/arch-tree-definition';
import { buildRouteLoadingTree } from './route-loading-tree';
import { buildComponentUsageTree } from './component-usage-tree';
import { buildServiceDependencyTree } from './service-dependency-tree';
import { buildModuleStructureTree } from './module-structure-tree';
import { buildRoutingHierarchyTree } from './routing-hierarchy-tree';

export const mapOfArchTreeBuilder: { [key in ArchTreeType]?: (storeData: any, projectName: string) => any } = {
  [ArchTreeType.RouteLoadingTree]: buildRouteLoadingTree,
  [ArchTreeType.RoutingHierarchyTree]: buildRoutingHierarchyTree,
  [ArchTreeType.ComponentUsageTree]: buildComponentUsageTree,
  [ArchTreeType.InjectorAndDependencyTree]: buildServiceDependencyTree,
  [ArchTreeType.ModuleStructureTree]: buildModuleStructureTree
};
