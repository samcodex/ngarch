import { ArchStoreData } from '../models/arch-store-data';
import { ArchTreeType } from '@core/arch-tree/arch-tree-definition';
import { ArchTree } from '@core/arch-tree/arch-tree';

export function buildComponentUsageTree(archStore: ArchStoreData, projectName: string): ArchTree {
  const treeType = ArchTreeType.ComponentUsageTree;
  const tree = new ArchTree(treeType, treeType);

  return tree;
}
