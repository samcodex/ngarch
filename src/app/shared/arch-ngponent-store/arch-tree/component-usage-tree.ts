
import { ArchStoreData } from '../models/arch-store-data';
import { ArchTreeType } from '@core/arch-tree/arch-tree-definition';
import { ArchTree } from '@core/arch-tree/arch-tree';
import { NgHierarchy, NgHierarchyTraverseType } from './ng-hierarchy';

export function buildComponentUsageTree(archStore: ArchStoreData, projectName: string): ArchTree {
  const ngHierarch = new NgHierarchy(archStore, projectName,
    NgHierarchyTraverseType.ComponentPath, ArchTreeType.ComponentUsageTree, 'Component Hierarchy');

  const tree = ngHierarch.buildArchTree();

  return tree;
}
