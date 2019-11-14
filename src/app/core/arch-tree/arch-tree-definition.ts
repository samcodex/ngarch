export enum ArchTreeType {
  RouteLoadingTree = 'RouteLoadingTree',            // FullView Hierarchy, The relation of route's 'children' & 'loadChildren'
  ComponentUsageTree = 'ComponentUsageTree',        // ComponentHierarchy, it is template->selector & route->children
  ServiceDependencyTree = 'ServiceDependencyTree',  // InjectorHierarchy, 'dependency' is the relation of injection and providing
  RoutingHierarchyTree = 'RoutingHierarchyTree',    // RoutingHierarchy
  ModuleStructureTree = 'ModuleStructureTree'       //
}

export enum ArchNodeMetaType {
  ArchNgPonentNode = 'ArchNgPonentNode',          // The node is related to ArchNgPonent.
  Other = 'Other'                                 // node is not related to ArchNgPonent. It is created for building tree.
                                                  // for other purpose
}
