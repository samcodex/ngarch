import { AnalysisElementType } from '@core/models/analysis-element';
import { DiagramTreeNode } from '@core/diagram-tree/diagram-tree-node';

enum InjectorCategory {
  NullInjector = 'NullInjector',
  PlatformModuleInjector = 'PlatformModuleInjector',
  ModuleInjector = 'ModuleInjector',
  ElementInjector = 'ElementInjector'
}

const ElementTypeToInjectorCategory = {
  [ AnalysisElementType.Module ]: InjectorCategory.ModuleInjector,
  [ AnalysisElementType.Component ]: InjectorCategory.ElementInjector,
};

const levelOrder = (node: {parent: any, children: any[]}, callback: Function, hook?: any) => {
  const newHook = callback(node, hook);
  return () => {
    if (node.children) {
      const navigators = node.children.map(child => levelOrder(child, callback, newHook));
      navigators.forEach(navigator => navigator());
    }
  };
};

export class InjectorTreeNode {
  category: InjectorCategory;
  host: DiagramTreeNode;
  children: InjectorTreeNode[];
  parent: InjectorTreeNode;
  rootModule = false;

  constructor(parent: InjectorTreeNode, host: DiagramTreeNode, category?: InjectorCategory) {
    this.parent = parent;
    this.host = host;

    if (category) {
      this.category = category;
    } else if (host) {
      this.category = ElementTypeToInjectorCategory[host.elementType];
    }

    if (parent) {
      parent.appendChildren(this);
    }
  }

  get name(): string {
    return this.host ? this.host.name : this.category;
  }

  get elementType(): AnalysisElementType {
    return this.host ? this.host.elementType : null;
  }

  appendChildren(node: InjectorTreeNode) {
    if (!this.children) {
      this.children = [];
    }
    this.children.push(node);
  }

  setRootModuleInjector() {
    this.rootModule = true;
  }
}

export class InjectorTree {
  root: InjectorTreeNode;

  constructor() {
  }

  get rootModuleInjector(): InjectorTreeNode {
    return this.root.children[0].children[0];
  }

  createInjectorTree(root: DiagramTreeNode) {
    const platformInjector = this.createPlatformInjectorNode();

console.log(root);
    levelOrder(root, function(node: DiagramTreeNode, upInjector: InjectorTreeNode) {
      const archNgPonent = node.archPonent;
      const injectors = node.getRelatedInjectorArchNgPonents();
      if (node.name === 'ArchComponent') {
        console.log(injectors);
      }
      if (archNgPonent.isLazyLoadingModule || injectors && injectors.length) {
        return new InjectorTreeNode(upInjector, node);
      } else {
        return upInjector;
      }
    }, platformInjector)();

    this.rootModuleInjector.setRootModuleInjector();
  }

  private createPlatformInjectorNode(): InjectorTreeNode {
    const nullInjector = new InjectorTreeNode(null, null, InjectorCategory.NullInjector);
    const platformInjector = new InjectorTreeNode(nullInjector, null, InjectorCategory.PlatformModuleInjector);

    this.root = nullInjector;

    return platformInjector;
  }
}
