import { ViewerExplanationComponent } from './../shared/viewer-explanation/viewer-explanation.component';
import { ArchUiType } from 'ng-arch-ui';

import { AnalysisElementType } from '@core/models/analysis-element';
import { ViewPurposeToUiClass, PonentActionPurpose } from './viewer-content-types';
import { PonentCliComponent } from '../diagrams/ponent-cli/ponent-cli.component';
import { ActivityDiagramComponent } from './../diagrams/activity-diagram/activity-diagram.component';
import { ClassVisualizerComponent } from './../diagrams/class-visualizer/class-visualizer.component';
import { StructureDiagramComponent } from '../diagrams/structure-diagram/structure-diagram.component';
import { CodeDiagramComponent } from './../diagrams/code-diagram/code-diagram.component';

const _mapOfGenericPurpose: ViewPurposeToUiClass[] = [
  {
    purpose: PonentActionPurpose.Typescript,
    clazz: CodeDiagramComponent,
    archUiOptions: { width: '70%'},
    resolve: { language: 'typescript'}
  },
  {
    purpose: PonentActionPurpose.ClassVisualizer,
    clazz: ClassVisualizerComponent,
    archUiOptions: { top: '50px', width: '400px'}
  },
  {
    purpose: PonentActionPurpose.StructureDiagram,
    clazz: StructureDiagramComponent,
    archUiOptions: { width: '600px'}
  },
  {
    purpose: PonentActionPurpose.ViewerExplanation,
    clazz: ViewerExplanationComponent,
    archUiOptions: { width: '600px', height: '300px'},
    uiType: ArchUiType.Panel
  }
];

const _mapOfModuleType: ViewPurposeToUiClass[] = [
  {
    type: AnalysisElementType.Module,
    purpose: PonentActionPurpose.ActivityDiagram,
    clazz: ActivityDiagramComponent,
    archUiOptions: { width: '70%'}
  },
  {
    type: AnalysisElementType.Module,
    purpose: PonentActionPurpose.AngularCli,
    clazz: PonentCliComponent,
    uiType: ArchUiType.Panel,
    archUiOptions: { width: '50%'}
  }
];

const _mapOfComponentType: ViewPurposeToUiClass[] = [
  {
    type: AnalysisElementType.Component,
    purpose: PonentActionPurpose.Html,
    clazz: CodeDiagramComponent,
    archUiOptions: { width: '70%'},
    resolve: { language: 'html'}
  },
  {
    type: AnalysisElementType.Component,
    purpose: PonentActionPurpose.Css,
    clazz: CodeDiagramComponent,
    archUiOptions: { width: '70%'},
    resolve: { language: 'css'}
  },
];


export const mapViewPurposeToUiClass: ViewPurposeToUiClass[] = [
  ..._mapOfGenericPurpose, ..._mapOfModuleType, ..._mapOfComponentType
];
