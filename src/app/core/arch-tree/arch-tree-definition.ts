export enum ArchTreeType {
  RouteLoadingTree = 'RouteLoadingTree',          // The relation of route's 'children' & 'loadChildren'
  ComponentUsageTree = 'ComponentUsageTree',      // The usage relation is in the template
  ServiceDependencyTree = 'ServiceDependencyTree', // 'dependency' is the relation of injection and providing
  ModuleStructureTree = 'ModuleStructureTree'       //
}

export enum ArchNodeMetaType {
  ArchNgPonentNode = 'ArchNgPonentNode',          // The node is related to ArchNgPonent.
  Other = 'Other'                                 // node is not related to ArchNgPonent. It is created for building tree.
                                                  // for other purpose
}
