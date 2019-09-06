import { Type } from '@angular/core';
import { forOwn, cloneDeep } from 'lodash-es';
import { NgArchUiElementOptions, ArchUiType } from 'ng-arch-ui';

import { AnalysisElementType } from '@core/models/analysis-element';
import { UiElementItem } from '@core/models/ui-element-item';
import { DiagramLinkableElement } from '@core/diagram-element-linkable/diagram-linkable-element';
import { ArchHierarchyPointNode } from '../layout/arch-tree-layout/arch-hierarchy';
import { NgPonentType } from '@core/ngponent-tsponent/ngponent-definition';
import { ArchPonentFeature } from '@core/arch-ngponent/arch-ngponent-definition';
import { DiagramTreeNode } from '@core/diagram-tree/diagram-tree-node';
import { DiagramViewerType, ViewerType } from './ng-app-viewer-definition';

export enum PonentActionPurpose {
  Typescript = 'Typescript',
  AngularCli = 'AngularCli',
  ActivityDiagram = 'ActivityDiagram',
  ClassVisualizer = 'ClassVisualizer',
  StructureDiagram = 'StructureDiagram',
  DependencyDiagram = 'DependencyDiagram',
  ToggleCollapseChildren = 'ToggleCollapseChildren',
  Html = 'Html',
  Css = 'Css',
  ViewerExplanation = 'ViewerExplanation'
}

export enum PonentActionScope {
  ComponentAction = 'ComponentAction',
  LayoutAction = 'LayoutAction'
}

// action(menu) item
export type PonentActionItem = UiElementItem<DiagramTreeNode | DiagramLinkableElement, PonentActionPurpose, PonentActionScope>;

export interface ArchUiDiagramComponent {
  data: any;
  fromViewer: ViewerType | DiagramViewerType;
  options?: any;
}

// type of mapping
export interface ViewPurposeToUiClass {
  type?: AnalysisElementType | AnalysisElementType[];
  purpose?: PonentActionPurpose | PonentActionPurpose[];

  clazz?: Type<ArchUiDiagramComponent>;
  archUiOptions?: NgArchUiElementOptions;
  uiType?: ArchUiType;
  resolve?: any;
}

const ToggleCollapseChildrenFn = (node: ArchHierarchyPointNode) => {
  const archPonent = node.data.getArchNgPonent();
  if (archPonent.ngPonentType === NgPonentType.NgModule) {
    return archPonent.hasNgFeature(ArchPonentFeature.RouterModuleForRoot);
  }
  return false;
};

const actionDefinition: PonentActionItem[] = [
  {
    name: 'Typescript',
    value: PonentActionPurpose.Typescript,
    tip: 'Typescript code',
    icon: 'TS',
    type: PonentActionScope.ComponentAction
  },
  {
    name: 'Angular Cli',
    value: PonentActionPurpose.AngularCli,
    tip: 'Execute Angular Cli related to the element',
    icon: '@',
    type: PonentActionScope.ComponentAction
  },
  {
    name: 'Activity Diagram',
    value: PonentActionPurpose.ActivityDiagram,
    tip: 'Activity Diagram',
    icon: 'A',
    type: PonentActionScope.ComponentAction
  },
  {
    name: 'Dependency Diagram',
    value: PonentActionPurpose.DependencyDiagram,
    tip: 'Dependency Diagram',
    icon: 'D',
    type: PonentActionScope.ComponentAction
  },
  {
    name: 'Class Visualizer',
    value: PonentActionPurpose.ClassVisualizer,
    tip: 'Visualize Class',
    icon: 'V',
    type: PonentActionScope.ComponentAction
  },
  {
    name: 'Structure Diagram',
    value: PonentActionPurpose.StructureDiagram,
    tip: 'Structure Diagram',
    icon: 'S',
    type: PonentActionScope.ComponentAction
  },
  {
    name: 'CSS Code',
    value: PonentActionPurpose.Css,
    tip: 'CSS Code',
    icon: 'CSS',
    type: PonentActionScope.ComponentAction
  },
  {
    name: 'HTML Code',
    value: PonentActionPurpose.Html,
    tip: 'HTML Code',
    icon: 'HTML',
    type: PonentActionScope.ComponentAction
  },
  {
    name: 'Toggle Collapse Routing Children',
    value: PonentActionPurpose.ToggleCollapseChildren,
    tip: 'Collapse/Expand Routing Children\'s Elements',
    icon: 'unfold_less',
    iconType: 'material',
    type: PonentActionScope.LayoutAction,
    filterFn: ToggleCollapseChildrenFn
  }
];

const _ponentActions: {[key in AnalysisElementType]?: PonentActionPurpose[] } = {
  [ AnalysisElementType.Application ]: [
    // PonentActionPurpose.ActivityDiagram,
    // PonentActionPurpose.Typescript,
    // PonentActionPurpose.AngularCli,
  ],
  [ AnalysisElementType.Module ]: [
    PonentActionPurpose.ActivityDiagram,
    PonentActionPurpose.StructureDiagram,
    PonentActionPurpose.ClassVisualizer,
    PonentActionPurpose.ToggleCollapseChildren,
    PonentActionPurpose.Typescript,
    PonentActionPurpose.AngularCli
  ],
  [ AnalysisElementType.Component ]: [
    // PonentActionPurpose.ActivityDiagram,
    // PonentActionPurpose.StructureDiagram,
    PonentActionPurpose.ClassVisualizer,
    PonentActionPurpose.Typescript,
    PonentActionPurpose.Html,
    PonentActionPurpose.Css,
  ],
  [ AnalysisElementType.Directive ]: [
    PonentActionPurpose.ClassVisualizer,
    PonentActionPurpose.Typescript,
  ],
  [ AnalysisElementType.Service ]: [
    PonentActionPurpose.ClassVisualizer,
    PonentActionPurpose.DependencyDiagram,
    PonentActionPurpose.Typescript
  ]
};

export function getArchPonentActions(): {[key in AnalysisElementType]?: PonentActionPurpose[] } {
  const archPonentActions = {};
  const ponentActions = cloneDeep(_ponentActions);

  forOwn(ponentActions, (actions: PonentActionPurpose[], type: AnalysisElementType) => {
    archPonentActions[type] = actions.map(action => {
      const found = actionDefinition.find(tip => tip.value === action);
      let item = null;
      if (found) {
        item = Object.assign({type}, found);
        item.data = null;
      }
      return item;
    });
  });

  return archPonentActions;
}

function _findByType(type: AnalysisElementType) {
  return (data: ViewPurposeToUiClass) => {
    return Array.isArray(data.type) ? data.type.includes(type) : data.type === type;
  };
}

function _findByActionPurpose(purpose: PonentActionPurpose) {
  return (data: ViewPurposeToUiClass) => {
    return Array.isArray(data.purpose) ? data.purpose.includes(purpose) : data.purpose === purpose;
  };
}

export function findPonentViewerUiClass(uiClasses: ViewPurposeToUiClass[], type?: AnalysisElementType, purpose?: PonentActionPurpose): ViewPurposeToUiClass {
  let found: ViewPurposeToUiClass = null;

  if (type && purpose) {
    found = uiClasses.find((oneConfig) => _findByType(type)(oneConfig) && _findByActionPurpose(purpose)(oneConfig));
  }

  if (!found && purpose) {
    found = uiClasses.find(_findByActionPurpose(purpose));
  }

  if (!found && type) {
    found = uiClasses.find(_findByType(type));
  }

  return found;
}
