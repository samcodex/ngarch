import { Component, OnInit } from '@angular/core';

import { ArchUiDiagramComponent } from 'app/ng-app-viewer/models/viewer-content-types';
import { ViewerType, DiagramViewerType } from 'app/ng-app-viewer/models/ng-app-viewer-definition';

const typeOfActivityDiagram = [ ViewerType.AppArchViewer, DiagramViewerType.ActivityDiagram ];
@Component({
  selector: 'arch-viewer-explanation',
  templateUrl: './viewer-explanation.component.html',
  styleUrls: ['./viewer-explanation.component.scss']
})
export class ViewerExplanationComponent implements OnInit, ArchUiDiagramComponent {
  data: any;
  fromViewer: ViewerType | DiagramViewerType;

  constructor() { }

  ngOnInit() {
  }

  isActivityDiagram() {
    return typeOfActivityDiagram.includes(this.fromViewer);
  }
}
