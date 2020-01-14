import { ArchStoreData } from '../models/arch-store-data';
import { ArchTreeType } from '@core/arch-tree/arch-tree-definition';
import { ArchTree } from '@core/arch-tree/arch-tree';
import { NgHierarchy, NgHierarchyTraverseType } from './ng-hierarchy';

export function buildServiceDependencyTree(archStore: ArchStoreData, projectName: string): ArchTree {
  const ngHierarch = new NgHierarchy(archStore, projectName,
    NgHierarchyTraverseType.RoutingComponentPath, ArchTreeType.InjectorAndDependencyTree, 'Injector & Dependency Hierarchy');

  const tree = ngHierarch.buildArchTree();

  return tree;
}
