import { ArchNgPonent, ArchNgPonentModule, ArchNgPonentComponent, ArchNgPonentInjectable } from '@core/arch-ngponent';
import { ArchNodeMetaType, ArchTreeType } from './arch-tree-definition';
import { AnalysisElementType } from '@core/models/analysis-element';
import { ArchNgPonentRoute } from '@core/arch-ngponent/arch-ngponent-route';
import { ArchWrapper } from '../models/arch-wrapper';
import { mapNgPonentTypeToElementType } from '@core/diagram-element-linkable/diagram-linkable-definition';
import { NgPonentType, NgPonentFeature } from '@core/ngponent-tsponent/ngponent-definition';
import { TsPonent } from '@core/ngponent-tsponent';

export class ArchNode<T extends ArchNgPonent = ArchNgPonent> {
  name: string;
  private _archNgPonent: T;
  _tsPonent: TsPonent;

  private _children: ArchNode[];
  private _parent: ArchNode;
  private _archTree: ArchTree;
  private _metaType: ArchNodeMetaType = ArchNodeMetaType.ArchNgPonentNode;
  private _relatedArchNgPonents: { [key in AnalysisElementType]?: ArchWrapper<ArchNode, ArchNgPonent> };
  private _expectAnalysisType: AnalysisElementType;

  constructor(tree: ArchTree, parent: ArchNode, archNgPonent: T, name?: string) {
    this._archTree = tree;
    this._parent = parent;
    this._archNgPonent = archNgPonent;
    this.name = name ? name : archNgPonent.name;
  }

  static createApplicationNode(name: string): ArchNode {
    return ArchNode.createAnalysisNode(AnalysisElementType.Application, name);
  }

  static createSingleNode(archNgPonent: ArchNgPonent): ArchNode {
    return new ArchNode(null, null, archNgPonent);
  }

  static createTsPonentNode(tree: ArchTree, parent: ArchNode, tsPonent: TsPonent): ArchNode {
    const node = new ArchNode(tree, parent, null, tsPonent.name);
    node._tsPonent = tsPonent;
    return node;
  }

  static createAnalysisNode(analysisType: AnalysisElementType, name: string): ArchNode {
    const node = new ArchNode(null, null, null, name);
    node.changeExpectAnalysisType(analysisType);
    return node;
  }

  get archNgPonent(): T {
    return this._archNgPonent;
  }

  get children(): ArchNode[] {
    return this._children;
  }

  get isLeaf(): boolean {
    return !this.isNode;
  }

  get isNode(): boolean {
    return !!this._children && Array.isArray(this._children) && this._children.length > 0;
  }

  get archAnalysisType(): AnalysisElementType {
    if (this._expectAnalysisType) {
      return this._expectAnalysisType;
    } else {
      const ngType = this._archNgPonent.ngPonentType;
      return mapNgPonentTypeToElementType(ngType);
    }
  }

  get archPonentType (): NgPonentType {
    const archNgPonent = this._archNgPonent ? this._archNgPonent : null;
    return archNgPonent ? archNgPonent.ngPonentType : null;
  }

  appendChildNode(node: ArchNode) {
    if (!this._children) {
      this._children = [];
    }
    this._children.push(node);
  }

  appendChildNgPonent<S extends ArchNgPonent = ArchNgPonent>(ponent: S, name?: string, allowDuplicated = false): ArchNode<S> {
    const found = allowDuplicated ? false : this.findNodeByArchPonent(ponent);
    if (found) {
      return found as ArchNode<S>;
    } else {
      const node = new ArchNode<S>(this._archTree, this, ponent, name);
      this.appendChildNode(node);
      return node;
    }
  }

  changeExpectAnalysisType(type: AnalysisElementType) {
    this._expectAnalysisType = type;
  }

  getRelatedFromLabel(): string {
    const wrapper = this.getRelatedArchWrapperByType(AnalysisElementType._From);
    return wrapper ? wrapper.label : null;
  }

  getRelatedOfFirstRoutePonent(): ArchNgPonentRoute {
    const wrapper = this.getRelatedArchWrapperByType(AnalysisElementType.Route);
    return wrapper ? wrapper.firstChild as ArchNgPonentRoute : null;
  }

  getRelatedProviderArchNgPonents(): ArchNgPonent[] {
    return this.getRelatedArchNgPonentsByType(AnalysisElementType._Provider);
  }

  // ModuleInjector or ElementInjector
  getRelatedInjectorArchNgPonents(): ArchNgPonentInjectable[] {
    return this.getRelatedArchNgPonentsByType(AnalysisElementType._Injector);
  }

  getRelatedCtorDependencies(): ArchNgPonentInjectable[] {
    return this.getRelatedArchNgPonentsByType(AnalysisElementType._Dependency);
  }

  getRelatedArchNgPonentsByType(type: AnalysisElementType): ArchNgPonent[] {
    const wrapper = this.getRelatedArchWrapperByType(type);
    return wrapper ? wrapper.children.filter(child => !!child ) : null;
  }

  getRelatedArchWrapperByType(type: AnalysisElementType): ArchWrapper<ArchNode, ArchNgPonent> {
    return this._relatedArchNgPonents ? this._relatedArchNgPonents[type] : null;
  }

  appendRelatedArchNgPonent(type: AnalysisElementType, archPonent: ArchNgPonent, from?: string) {
    let archNgPonents: ArchWrapper<ArchNode, ArchNgPonent> = null;
    if (this._relatedArchNgPonents) {
      archNgPonents = this._relatedArchNgPonents[type];
    } else {
      this._relatedArchNgPonents = {};
    }

    if (!archNgPonents) {
      archNgPonents = this._relatedArchNgPonents[type] = new ArchWrapper(this, from);
    }

    archNgPonents.appendChild(archPonent);
  }

  equalTo(node: ArchNode): boolean {
    const archPonent = this._archNgPonent;
    return archPonent.equalTo(node.archNgPonent);
  }

  findNode(node: ArchNode) {
    this._children.find(child => child.equalTo(node));
  }

  findNodeByArchPonent(archNgPonent: ArchNgPonent): ArchNode {
    return this._children ? this._children.find((child) => child.archNgPonent.equalTo(archNgPonent)) : null;
  }

  // ModuleInjector
  findNodeWithModuleInjector(): ArchNode {
    const features = this._archNgPonent.ngPonentFeatures;
    if (features && (features.includes(NgPonentFeature.BootstrapModule) || features.includes(NgPonentFeature.LazyLoading))) {
      return this;
    } else {
      return this._parent.findNodeWithModuleInjector();
    }
  }

  // clone(archTree: ArchTree, parent: ArchNode): ArchNode {
  //   const clonedNode = new ArchNode(archTree, parent, this._archNgPonent, this.name);
  //   clonedNode._tsPonent = this._tsPonent;

  //   if (this._relatedArchNgPonents) {
  //     const relatedKeys = Object.keys(this._relatedArchNgPonents);
  //     relatedKeys.forEach(key => {
  //       clonedNode.appendRelatedArchNgPonent(key as AnalysisElementType, this._relatedArchNgPonents[key]);
  //     });
  //   }

  //   if (this._expectAnalysisType) {
  //     clonedNode.changeExpectAnalysisType(this._expectAnalysisType);
  //   }

  //   if (this._children) {
  //     this._children
  //       .forEach(child => {
  //         clonedNode.appendChildNode(child.clone(clonedNode._archTree, clonedNode));
  //       });
  //   }

  //   return clonedNode;
  // }
}

export class ArchTree {
  name: string;
  treeType: ArchTreeType;
  archRoot: ArchNode;

  constructor(treeName: string, treeType: ArchTreeType) {
    this.name = treeName;
    this.treeType = treeType;
  }

  createRootNode<T extends ArchNgPonent = ArchNgPonent>(archPonent: T): ArchNode<T> {
    return this.archRoot = new ArchNode<T>(this, null, archPonent);
  }

  // clone(): ArchTree {
  //   const clonedTree = new ArchTree(this.name, this.treeType);
  //   clonedTree.archRoot = this.archRoot.clone(clonedTree, null);
  //   return clonedTree;
  // }
}
