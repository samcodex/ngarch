export enum ArchTreeType {
  RouteLoadingTree = 'RouteLoadingTree',            // FullView Hierarchy, The relation of route's 'children' & 'loadChildren'
  ComponentUsageTree = 'ComponentUsageTree',        // ComponentHierarchy, it is template->selector & route->children
  InjectorAndDependencyTree = 'InjectorAndDependencyTree',  // for Injector, Provider and Dependency hierarchy
  RoutingHierarchyTree = 'RoutingHierarchyTree',    // RoutingHierarchy
  ModuleStructureTree = 'ModuleStructureTree',      //
  ServiceDependencyTree = 'ServiceDependencyTree'
}

export enum ArchNodeMetaType {
  ArchNgPonentNode = 'ArchNgPonentNode',          // The node is related to ArchNgPonent.
  Other = 'Other'                                 // node is not related to ArchNgPonent. It is created for building tree.
                                                  // for other purpose
}
