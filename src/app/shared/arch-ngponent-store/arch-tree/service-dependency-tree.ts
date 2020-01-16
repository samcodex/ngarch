import { ArchNgPonentInjectable } from './../../../core/arch-ngponent/arch-ngponent-injectable';
import { ArchNgPonentComponent } from './../../../core/arch-ngponent/arch-ngponent-component';
import { ArchStoreData } from '../models/arch-store-data';
import { ArchTreeType } from '@core/arch-tree/arch-tree-definition';
import { ArchTree, ArchNode } from '@core/arch-tree/arch-tree';
import { NgHierarchy, NgHierarchyTraverseType } from './ng-hierarchy';
import { ArchNgPonent } from '@core/arch-ngponent';

export function buildServiceDependencyTree(archStore: ArchStoreData, projectName: string): ArchTree {
  const ngHierarch = new NgHierarchy(archStore, projectName,
    NgHierarchyTraverseType.RoutingComponentPath, ArchTreeType.InjectorAndDependencyTree, 'Injector & Dependency Hierarchy');

  const tree = ngHierarch.buildArchTree();

  tree.traverse((node: ArchNode) => {
    const archPonent = node.archNgPonent;
    if (archPonent instanceof ArchNgPonentComponent) {
      node.setDependencyArchTree(convertArchPonentToDependencyTree(archPonent));
    }
  });

  return tree;
}

export function convertArchPonentToDependencyTree(rootArchPonent: ArchNgPonent): ArchTree {
  if (rootArchPonent instanceof ArchNgPonentComponent || rootArchPonent instanceof ArchNgPonentInjectable) {
    const treeType = ArchTreeType.ServiceDependencyTree;
    const tree = new ArchTree(treeType, treeType);
    const root = new ArchNode(tree, null, rootArchPonent);
    tree.archRoot = root;

    const existDependencies = [];
    const filterExist = (archPonent: ArchNgPonent) => !existDependencies.includes(archPonent);

    const convertArchPonentToArchNode = (node: ArchNode) => {
      const archPonent = node.archNgPonent;
      const dependencies: ArchNgPonentInjectable[] = archPonent.archRelationship.getArchNgPonentOfDependenciesFromCtor();

      if (dependencies && dependencies.length) {
        const validDependencies = dependencies.filter(filterExist);
        if (validDependencies.length) {
          existDependencies.push.apply(existDependencies, validDependencies);
          validDependencies.forEach(validDependency => {
            const validNode = node.appendChildNgPonent(validDependency);

            convertArchPonentToArchNode(validNode);
          });
        }
      }
    };

    convertArchPonentToArchNode(root);

    return tree;
  }

  return null;
}
