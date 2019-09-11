import { DiagramTreeNode } from '@core/diagram-tree/diagram-tree-node';
import { AnalysisElementType } from '@core/models/analysis-element';
import { NgPonentType } from '@core/ngponent-tsponent/ngponent-definition';

export function mapArchNodeToDiagramTreeNode(node: DiagramTreeNode) {
  const nodeType = node.elementType;

  if (nodeType === AnalysisElementType.Application) {
    assignApplicationInfo(node);
  } else if (nodeType === AnalysisElementType.Module) {
    assignModuleInfo(node);
  } else if (nodeType === AnalysisElementType.Component) {
    assignComponentInfo(node);
  } else if (nodeType === AnalysisElementType.Service) {
    assignServiceInfo(node);
  }

}

function assignApplicationInfo(node: DiagramTreeNode): void {
  node.nodeInfo = 'Angular Application: ' + node.name;
}

function assignModuleInfo(node: DiagramTreeNode): void {
  const archPonent = node.archPonent;

  node.nodeInfo = '@NgModule, ' + node.name;
  if (archPonent.isBootstrapModule) {
    node.nodeInfo += '<br/><i class="material-icons" style="font-size:10px;">fiber_manual_record</i>';
    node.nodeInfo += 'Bootstrap Module';
    node.upLinkInfo = 'Eager loading';
  } else if (archPonent.isRootOfLoadingGroup) {
    node.upLinkInfo = 'Lazy loading, from Routes';
  } else {
    node.upLinkInfo = 'Through NgModule Imports';
  }
}

function assignComponentInfo(node: DiagramTreeNode): void {
  const archNgPonent = node.archPonent;
  const upConnection = archNgPonent.archRelationship.upConnections[0];

  node.nodeInfo = '@Component, ' + node.name;
  if (upConnection.endOfPonentType === NgPonentType.NgModule) {
    node.upLinkInfo = 'Through NgModule Declaration';
  } else {
    node.upLinkInfo = 'Through Component Template';
  }
}

function assignServiceInfo(node: DiagramTreeNode): void {
  const archNgPonent = node.archPonent;
  const upConnection = archNgPonent.archRelationship.upConnections[0];

  node.nodeInfo = '@Injectable, ' + node.name;
  node.upLinkInfo = `Through ${upConnection.endOfPonentType} Providers`;
}
