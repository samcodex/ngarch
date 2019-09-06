import { ArchNgPonentInjectable } from './../arch-ngponent/arch-ngponent-injectable';
import { ArchNgPonentRoute } from '@core/arch-ngponent/arch-ngponent-route';
import { DiagramElement } from './../diagram/diagram-element';
import { ArchNode } from './../arch-tree/arch-tree';
import { DiagramTreeContext } from './diagram-tree-context';
import { AnalysisElementType } from '@core/models/analysis-element';

export class DiagramTreeNode extends DiagramElement {
  archNode: ArchNode;

  tree: DiagramTreeContext;
  children: DiagramTreeNode[];
  parent: DiagramTreeNode;

  disabled = false;
  bottomLine: string;
  isCollapsed = false;
  isSelected = false;
  isClickable = true;

  constructor(tree: DiagramTreeContext, node: ArchNode, parent: DiagramTreeNode, mapNodeFn?: Function) {
    super(node.archAnalysisType, node.archNgPonent, node.name);
    this.parent = parent;
    this.tree = tree;
    this.archNode = node;

    if (mapNodeFn) {
      mapNodeFn(this);
    }

    if (node.isNode) {
      this.children = node.children.map(child => new DiagramTreeNode(tree, child, this, mapNodeFn));
    }
  }

  get firstChild(): DiagramTreeNode {
    return this.children && this.children.length ? this.children[0] : null;
  }

  get grandChild(): DiagramTreeNode {
    const child = this.firstChild;
    return child ? child.firstChild : null;
  }

  get gradGrandChild(): DiagramTreeNode {
    const child = this.firstChild;
    return child ? child.grandChild : null;
  }

  getRelatedRoutePonent(): ArchNgPonentRoute {
    return this.archNode.getRelatedOfFirstRoutePonent();
  }

  getRelatedProviderPonents(): ArchNgPonentInjectable[] {
    return this.archNode.getRelatedProviderArchNgPonents();
  }

  traverse(callback: Function) {
    if (callback) {
      callback(this);

      if (this.children) {
        this.children.forEach(child => {
          child.traverse(callback);
        });
      }
    }
  }

  toggleCollapsed() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleSelected() {
    this.isSelected = !this.isSelected;
  }

  toggleCollapsedChildren() {
    if (this.children) {
      this.children.forEach(child => child.toggleCollapsed());
    }
  }

  toggleCollapsedChildrenWhichNoRoutes() {
    if (this.children) {
      this.children.forEach(child => {

        if (child.getElementType() === AnalysisElementType.Routes || child.getElementType() === AnalysisElementType.Route) {
          child.toggleCollapsedChildrenWhichNoRoutes();
        } else {
          child.toggleCollapsed();
        }
      });
    }
  }
}
