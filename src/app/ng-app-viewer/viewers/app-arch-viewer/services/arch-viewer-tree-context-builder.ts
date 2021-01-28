import { ArchPonentFeature, ArchNgPonentComponent } from '@core/arch-ngponent';
import { DiagramTreeContext } from '@core/diagram-tree/diagram-tree-context';
import { DiagramTreeNode } from '@core/diagram-tree/diagram-tree-node';

export function filterArchViewerTreeContextWithRoutes(treeContext: DiagramTreeContext): void {
  traverseNode(treeContext.root);
}

function traverseNode(node: DiagramTreeNode) {
  const archPonent = node.archPonent;
  const hasRouterFeature = archPonent.hasNgFeature(ArchPonentFeature.RouterModuleForRoot)
    || archPonent.hasNgFeature(ArchPonentFeature.RouterModuleForChild)
    // || archPonent instanceof ArchNgPonentComponent
    ;

  if (hasRouterFeature && node.firstChild && node.firstChild.children) {
    node.children = node.firstChild.children
      .map(child => child.firstChild)
      .filter(child => !!child)
      ;
  }

  if (node.children) {
    node.children.forEach(traverseNode);
  }
}
