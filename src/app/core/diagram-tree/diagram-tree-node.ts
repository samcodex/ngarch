import { ArchNgPonentRoute } from '@core/arch-ngponent/arch-ngponent-route';
import { DiagramElement } from './../diagram/diagram-element';
import { ArchNode } from './../arch-tree/arch-tree';
import { DiagramTreeContext } from './diagram-tree-context';
import { AnalysisElementType } from '@core/models/analysis-element';
import { ArchNgPonentInjectable } from '@core/arch-ngponent';
import { InjectorTree, InjectorTreeNode } from './injector-tree';

export class DiagramTreeNode extends DiagramElement {
  archNode: ArchNode;
  nodeInfo: string;
  upLinkInfo: string;

  tree: DiagramTreeContext;
  children: DiagramTreeNode[];
  parent: DiagramTreeNode;

  disabled = false;
  bottomLine: string;
  topLine: string;
  isCollapsed = false;
  isSelected = false;
  isClickable = true;
  isCollapsedByUser = false;

  // reference to d3.hierarchy
  _hierarchyNode: any;

  injectorSubTree: InjectorTree;
  injectorTreeNode: InjectorTreeNode;

  _dependencyDiagramTree: DiagramTreeContext;

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

  // display NgModule's and Component's provider in the node details
  getRelatedProviderPonents(): ArchNgPonentInjectable[] {
    return this.archNode.getRelatedProviderArchNgPonents();
  }

  // ModuleInjector or ElementInjector
  getRelatedInjectorArchNgPonents(): ArchNgPonentInjectable[] {
    return this.archNode.getRelatedInjectorArchNgPonents();
  }

  // Dependencies of Component's ctor
  getRelatedCtorDependencies(): ArchNgPonentInjectable[] {
    return this.archNode.getRelatedCtorDependencies();
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

  traverseDependencyTree(callback: Function) {
    if (callback) {
      if (this._dependencyDiagramTree) {
        this._dependencyDiagramTree.traverse(callback);
      }

      if (this.children) {
        this.children.forEach(child => {
          child.traverseDependencyTree(callback);
        });
      }
    }
  }

  toggleCollapsed(collapsed: boolean): boolean {
    // if this method is triggered by its parent, collapsed is true or false
    // if this method is triggered by user, collapsed is null
    this.isCollapsedByUser = collapsed === null;
    this.isCollapsed = collapsed === true || collapsed === false ? collapsed : !this.isCollapsed;
    if (this.injectorTreeNode) {
      this.isCollapsed ? this.injectorTreeNode.collapse() : this.injectorTreeNode.expand();
    }

    return this.isCollapsed;
  }

  collapseOnly() {
    this.isCollapsed = true;
  }

  collapse() {
    this.isCollapsed = true;
    if (this.injectorTreeNode) {
      this.injectorTreeNode.collapse();
    }
  }

  expand() {
    this.isCollapsed = false;
    if (this.injectorTreeNode) {
      this.injectorTreeNode.expand();
    }
  }

  toggleSelected() {
    this.isSelected = !this.isSelected;
  }

  toggleCollapsedChildren() {
    if (this.children) {
      this.children.forEach(child => {
        child.toggleCollapsed(this.isCollapsed);
        child.toggleCollapsedChildren();
      });
    }
  }

  toggleCollapsedChildrenWhichNoRoutes() {

    if (this.children) {
      this.children.forEach(child => {

        if (child.getElementType() === AnalysisElementType.Routes || child.getElementType() === AnalysisElementType.Route) {
          child.toggleCollapsedChildrenWhichNoRoutes();
        } else {
          child.toggleCollapsed(null);
        }
      });
    }
  }
}
