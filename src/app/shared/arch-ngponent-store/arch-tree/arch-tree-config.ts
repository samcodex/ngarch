import { ArchTreeType } from '@core/arch-tree/arch-tree-definition';
import { buildRouteLoadingTree } from './route-loading-tree';
import { buildComponentUsageTree } from './component-usage-tree';
import { buildServiceDependencyTree } from './service-dependency-tree';
import { buildModuleStructureTree } from './module-structure-tree';

export const mapOfArchTreeBuilder: { [key in ArchTreeType]: (storeData: any, projectName: string) => any } = {
  [ArchTreeType.RouteLoadingTree]: buildRouteLoadingTree,
  [ArchTreeType.ComponentUsageTree]: buildComponentUsageTree,
  [ArchTreeType.ServiceDependencyTree]: buildServiceDependencyTree,
  [ArchTreeType.ModuleStructureTree]: buildModuleStructureTree
};
