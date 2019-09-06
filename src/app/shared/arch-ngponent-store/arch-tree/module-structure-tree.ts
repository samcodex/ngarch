import { ArchStoreData } from '../models/arch-store-data';
import { ArchTreeType } from '@core/arch-tree/arch-tree-definition';
import { ArchTree, ArchNode } from '@core/arch-tree/arch-tree';
import { AnalysisElementType } from '@core/models/analysis-element';
import { NgPonentType } from '@core/ngponent-tsponent/ngponent-definition';
import { RelationshipType } from '@core/arch-relationship';
import { ArchNgPonent, ArchNgPonentModule } from '@core/arch-ngponent';

const relationTypes = [
  RelationshipType.Association,
  RelationshipType.Aggregation,
  RelationshipType.Composite,
  RelationshipType.Dependency
];

export function buildModuleStructureTree(archStore: ArchStoreData, projectName: string): ArchTree {
  const treeType = ArchTreeType.ModuleStructureTree;
  const tree = new ArchTree(treeType, treeType);
  const root = new ArchNode(tree, null, null, projectName);
  root.changeExpectAnalysisType(AnalysisElementType.Application);
  tree.archRoot = root;

  const ponents = archStore.getRootModulesOfLoadingGroup();
  appendNodeArchPonents(root, ponents);

  return tree;
}

export function convertArchPonentToStructureTree(archPonent: ArchNgPonent): ArchTree {
  const treeType = ArchTreeType.ModuleStructureTree;
  const tree = new ArchTree(treeType, treeType);
  const root = new ArchNode(tree, null, archPonent);
  tree.archRoot = root;

  if (root.archPonentType === NgPonentType.NgModule) {
    convertModuleNodeToStructureSubTree(root);
  }

  return tree;
}

function appendNodeArchPonents(parentNode: ArchNode, archPonents: ArchNgPonent[]) {
  archPonents.forEach(archPonent => {
  const node = parentNode.appendChildNgPonent(archPonent);
    if (node.archPonentType === NgPonentType.NgModule) {
      convertModuleNodeToStructureSubTree(node);
    }
  });
}

export function convertModuleNodeToStructureSubTree(node: ArchNode<ArchNgPonentModule>) {
  if (node.archPonentType === NgPonentType.NgModule) {
    const archPonent = node.archNgPonent;
    const archPonents = archPonent.getSpecificDependencies(relationTypes);
    appendNodeArchPonents(node, archPonents);
  }
}
