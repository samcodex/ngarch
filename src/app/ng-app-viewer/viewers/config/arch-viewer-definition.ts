import { ArchTreeType } from '@core/arch-tree/arch-tree-definition';

export enum ArchViewerOptionCategory {
  Hierarchy = 'Hierarchy',
  Orientation = 'Orientation',
  TreeNodes = 'TreeNodes',
  ViewerType = 'ViewerType',
  ExtraService = 'ExtraService'
}

export enum ArchViewerHierarchy {
  FullView = 'FullView',
  ComponentHierarchy = 'ComponentHierarchy',
  RoutingHierarchy = 'RoutingHierarchy',
  InjectorHierarchy = 'InjectorHierarchy'
}

export enum ArchViewerNodeType {
  IncludeRoutes = 'IncludeRoutes',
}

export enum ArchViewerType {
  RoutesTree = 'RoutesTree',
  FullRouteComponentTree = 'FullRouteComponentTree',
}

export enum ArchViewerExtraContent {
  LayerServiceProvider = 'LayerServiceProvider'
}

export const mapOfViewerHierarchyToArchTree: { [ key in ArchViewerHierarchy ]: ArchTreeType} = {
  [ ArchViewerHierarchy.FullView ]: ArchTreeType.RouteLoadingTree,
  [ ArchViewerHierarchy.ComponentHierarchy ]: ArchTreeType.ComponentUsageTree,
  [ ArchViewerHierarchy.RoutingHierarchy ]: ArchTreeType.RoutingHierarchyTree,
  [ ArchViewerHierarchy.InjectorHierarchy ]: ArchTreeType.InjectorAndDependencyTree
};

export const mapViewerHierarchyToArchTree = (hierarchy: ArchViewerHierarchy) => mapOfViewerHierarchyToArchTree[hierarchy];
