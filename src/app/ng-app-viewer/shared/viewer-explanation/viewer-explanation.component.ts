import { Component, OnInit } from '@angular/core';

import { ArchUiDiagramComponent } from '../../models/viewer-content-types';
import { ViewerType, DiagramViewerType } from '../../models/ng-app-viewer-definition';
import { ArchViewerHierarchy } from '../../viewers/config/arch-viewer-definition';

const typeOfActivityDiagram = [ ViewerType.AppArchViewer, DiagramViewerType.ActivityDiagram ];
const typeOfModuleStructure = [ ViewerType.ModuleStructureTree, DiagramViewerType.StructureDiagram ];
const typeOfComponentHierarchy = [ ArchViewerHierarchy.ComponentHierarchy ];
const typeOfRougingHierarchy = [ ArchViewerHierarchy.RoutingHierarchy ];

@Component({
  selector: 'arch-viewer-explanation',
  templateUrl: './viewer-explanation.component.html',
  styleUrls: ['./viewer-explanation.component.scss']
})
export class ViewerExplanationComponent implements OnInit, ArchUiDiagramComponent {
  data: any;
  fromViewer: ArchViewerHierarchy | ViewerType | DiagramViewerType;

  constructor() { }

  ngOnInit() {
  }

  isActivityDiagram() {
    return typeOfActivityDiagram.includes(this.fromViewer as any);
  }

  isModuleStructure() {
    return typeOfModuleStructure.includes(this.fromViewer as any);
  }

  isComponentHierarchy() {
    return typeOfComponentHierarchy.includes(this.fromViewer as any);
  }

  isRoutingHierarchy() {
    return typeOfRougingHierarchy.includes(this.fromViewer as any);
  }
}
