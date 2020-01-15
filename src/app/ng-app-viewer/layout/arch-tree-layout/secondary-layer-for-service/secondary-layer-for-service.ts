import { LayoutOptions } from '@core/diagram/layout-options';
import { ArchHierarchyPointNode } from '../arch-hierarchy';
import { d3Element } from '@core/svg/d3-def-types';
import { ArchHierarchyNodeDrawer } from '../arch-hierarchy-node-drawer';
import { SecondaryDependencyTree } from './secondary-dependency-tree';
import { SecondaryInjectorTree } from './secondary-injector-tree';

export class SecondaryLayerForService {
  private rootGroup: d3Element;
  private treeRoot: ArchHierarchyPointNode;
  private layoutOptions: LayoutOptions;
  private secondaryLayer: d3Element;
  private nodeDrawer: ArchHierarchyNodeDrawer;

  private injectorTree: SecondaryInjectorTree;
  private dependencyTree: SecondaryDependencyTree;

  constructor(
    rootGroup: d3Element,
    treeRoot: ArchHierarchyPointNode,
    layoutOptions: LayoutOptions,
    nodeDrawer: ArchHierarchyNodeDrawer,
    mainLayerCallbacks: { onClickAction: any, zoomFactorFn: any }
  ) {
    this.rootGroup = rootGroup;
    this.treeRoot = treeRoot;
    this.layoutOptions = layoutOptions;
    this.nodeDrawer = nodeDrawer;

    this.secondaryLayer = this.rootGroup.append('g').classed('secondary_layer_service', true);
    this.injectorTree = new SecondaryInjectorTree(this.secondaryLayer, rootGroup, treeRoot, layoutOptions, nodeDrawer, mainLayerCallbacks);
    this.dependencyTree = new SecondaryDependencyTree(this.secondaryLayer, rootGroup, treeRoot, layoutOptions, nodeDrawer);
  }

  clear() {
    this.secondaryLayer.selectAll('*').remove();
  }

  draw() {
    this.injectorTree.drawInjector();
    this.dependencyTree.drawDependency();
  }
}
