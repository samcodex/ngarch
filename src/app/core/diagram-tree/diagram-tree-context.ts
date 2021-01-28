import { DiagramTreeNode } from './diagram-tree-node';
import { ArchTree } from './../arch-tree/arch-tree';
import { DiagramElementContext } from '@core/diagram/diagram-element';
import { InjectorTree } from './injector-tree';
import { AnalysisElementType } from '@core/models/analysis-element';

export class DiagramTreeContext extends DiagramElementContext {
  archTree: ArchTree;
  root: DiagramTreeNode;

  constructor(tree: ArchTree, mapNodeFn?: Function, hasInjectorSubTree = false) {
    super(tree.name);

    this.archTree = tree;
    this.root = new DiagramTreeNode(this, tree.archRoot, null, mapNodeFn);

    if (hasInjectorSubTree) {
      const injectorTree = this.root.injectorSubTree = new InjectorTree();
      injectorTree.createInjectorTree(this.root);

      this.root.traverse((node: DiagramTreeNode) => {
        if (node.elementType === AnalysisElementType.Component) {
          if (node.archNode.dependencyArchTree) {
            node._dependencyDiagramTree = new DiagramTreeContext(node.archNode.dependencyArchTree);
          }
        }
      });
    }
  }

  traverse(callback: Function) {
    this.root.traverse(callback);
  }

  traverseInjectorTree(callback: Function) {
    if (this.root.injectorSubTree) {
      this.root.injectorSubTree.traverse(callback);
    }
  }

  traverseDependencyTree(callback: Function) {
    this.root.traverseDependencyTree(callback);
  }
}
