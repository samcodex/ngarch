import { DiagramTreeNode } from './diagram-tree-node';
import { ArchTree } from './../arch-tree/arch-tree';
import { DiagramElementContext } from '@core/diagram/diagram-element';

export class DiagramTreeContext extends DiagramElementContext {
  archTree: ArchTree;
  root: DiagramTreeNode;

  constructor(tree: ArchTree, mapNodeFn?: Function) {
    super(tree.name);

    this.archTree = tree;
    this.root = new DiagramTreeNode(this, tree.archRoot, null, mapNodeFn);
  }

  traverse(callback: Function) {
    this.root.traverse(callback);
  }
}
