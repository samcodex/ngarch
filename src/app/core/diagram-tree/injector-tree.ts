import { AnalysisElementType } from '@core/models/analysis-element';
import { DiagramTreeNode } from '@core/diagram-tree/diagram-tree-node';
import { DiagramElement } from './../diagram/diagram-element';
import { ArchNgPonent } from '@core/arch-ngponent/arch-ngponent';

enum InjectorNodeCategory {
  NullInjector = 'NullInjector',
  PlatformModuleInjector = 'PlatformModuleInjector',
  ModuleInjector = 'ModuleInjector',
  ElementInjector = 'ElementInjector',
  ServiceProvider = 'ServiceProvider'
}

const ElementTypeToInjectorCategory = {
  [ AnalysisElementType.Module ]: InjectorNodeCategory.ModuleInjector,
  [ AnalysisElementType.Component ]: InjectorNodeCategory.ElementInjector,
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

export class InjectorTreeNode extends DiagramElement {
  category: InjectorNodeCategory;
  host: DiagramTreeNode;
  children: InjectorTreeNode[];
  parent: InjectorTreeNode;
  rootModule = false;
  nodeInfo: string;
  upLinkInfo: string;

  private _isCollapsed = false;

  constructor(type: AnalysisElementType, archPonent: ArchNgPonent, parent: InjectorTreeNode, host: DiagramTreeNode,
      category?: InjectorNodeCategory, name?: string) {
    super(type, archPonent, name || category || ElementTypeToInjectorCategory[host.elementType]);

    this.parent = parent;
    this.host = host;
    this.category = category || ElementTypeToInjectorCategory[host.elementType];

    if (host) {
      host.injectorTreeNode = this;
    }

    if (parent) {
      parent.appendChildren(this);
    }
  }

  get isCollapsed(): boolean {
    return this._isCollapsed;
  }

  get isInjectorNode(): boolean {
    return !this.isProviderNode;
  }

  get isProviderNode(): boolean {
    return this.category === InjectorNodeCategory.ServiceProvider;
  }

  getProviderChildren(): InjectorTreeNode[] {
    return this.children ? this.children.filter(child => child.isProviderNode) : null;
  }

  getInjectorChildren(): InjectorTreeNode[] {
    return this.children ? this.children.filter(child => child.isInjectorNode) : null;
  }

  appendChildren(node: InjectorTreeNode) {
    if (!this.children) {
      this.children = [];
    }
    this.children.push(node);
  }

  collapse() {
    this._isCollapsed = true;
  }

  expand() {
    this._isCollapsed = false;
  }

  setRootModuleInjector() {
    this.rootModule = true;
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

    levelOrder(root, function(node: DiagramTreeNode, upInjector: InjectorTreeNode) {
      const archNgPonent = node.archPonent;
      const injectors = node.getRelatedInjectorArchNgPonents();
      if (archNgPonent.isLazyLoadingModule || injectors && injectors.length) {
        const newNode = new InjectorTreeNode(AnalysisElementType._Injector, null, upInjector, node);
        newNode.nodeInfo = 'Injector Hierarchy - ';
        newNode.nodeInfo += node.elementType === AnalysisElementType.Component ? 'Element Injector' : 'Module Injector';

        if (injectors) {
          injectors.forEach(injector => {
            const providerNode = new InjectorTreeNode(AnalysisElementType._Provider, injector, newNode, null,
              InjectorNodeCategory.ServiceProvider, injector.name);
            providerNode.nodeInfo = 'Service Provider';
          });
        }

        return newNode;
      } else {
        return upInjector;
      }
    }, platformInjector)();

    this.rootModuleInjector.setRootModuleInjector();
  }

  traverse(callback: Function) {
    this.root.traverse(callback);
  }

  private createPlatformInjectorNode(): InjectorTreeNode {
    const nullInjector = new InjectorTreeNode(AnalysisElementType._Injector, null,
      null, null, InjectorNodeCategory.NullInjector);
    nullInjector.nodeInfo = 'NullInjector, the top of the tree';

    const platformInjector = new InjectorTreeNode(AnalysisElementType._Injector, null,
      nullInjector, null, InjectorNodeCategory.PlatformModuleInjector);
    platformInjector.nodeInfo = 'ModuleInjector, configured by PlatformModule';

    this.root = nullInjector;

    return platformInjector;
  }
}
