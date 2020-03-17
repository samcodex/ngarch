import { Component, OnInit, ElementRef, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { NgArchUiContentComponent } from 'ng-arch-ui';

import { ArchNgPonent } from '@core/arch-ngponent';
import { DiagramOrganizer } from '@core/diagram';
import { DiagramLayoutToken } from '@core/diagram/diagram-layout';
import { LayoutOptions, Orientation } from '@core/diagram/layout-options';
import { NgAppViewerService } from '../../services/ng-app-viewer.service';
import { SvgZoomBoardComponent } from '@core/svg/svg-zoom-board-component';
import { PonentActionItem, PonentActionPurpose, ArchUiDiagramComponent } from '../../models/viewer-content-types';
import { ArchTreeLayout } from '../../layout/arch-tree-layout/arch-tree-layout';
import { DiagramElementFeature } from '@core/diagram/diagram-definition';
import { ArchNode, ArchTree } from '@core/arch-tree/arch-tree';
import { DiagramTreeContext } from '@core/diagram-tree/diagram-tree-context';
import { convertArchPonentToStructureTree } from '@shared/arch-ngponent-store/arch-tree/module-structure-tree';
import { DiagramTreeNode } from '@core/diagram-tree/diagram-tree-node';
import { ViewerType, DiagramViewerType } from '../../models/ng-app-viewer-definition';

@Component({
  templateUrl: './structure-diagram.component.html',
  styleUrls: ['./structure-diagram.component.scss'],
  providers: [
    DiagramOrganizer,
    { provide: DiagramLayoutToken, useClass: ArchTreeLayout },
  ]
})

export class StructureDiagramComponent extends SvgZoomBoardComponent
    implements OnInit, OnDestroy, AfterViewInit, NgArchUiContentComponent, ArchUiDiagramComponent {

  data: ArchNode | ArchNgPonent;
  fromViewer: ViewerType | DiagramViewerType;

  viewerType = DiagramViewerType.StructureDiagram;
  @ViewChild('svgBoard', {static: true}) svgBoardRef: ElementRef;

  constructor(
    elementRef: ElementRef,
    organizer: DiagramOrganizer,
    private ngAppViewerService: NgAppViewerService,
  ) {
    super(elementRef, organizer);

    this.organizer.addFeature(DiagramElementFeature.DblClick, this.onDoubleClickPonent.bind(this));
    this.organizer.addFeature(DiagramElementFeature.ActionClick, this.onClickAction.bind(this));
  }

  archOnResize(element: any) {
    this.board.resetSize(-1, -1, false);
  }

  ngOnInit() {
    super.onInit(this.svgBoardRef);
  }

  ngOnDestroy() {}

  ngAfterViewInit() {
    super.afterViewInit();

    this.setupStream();
  }

  private setupStream() {
    let diagramData: ArchNode | ArchTree;
    if (this.data instanceof ArchNode) {
      if (this.fromViewer !== this.viewerType) {
        diagramData = convertArchPonentToStructureTree(this.data.archNgPonent);
      } else {
        diagramData = this.data;
      }
    } else if (this.data instanceof ArchNgPonent) {
      diagramData = convertArchPonentToStructureTree(this.data);
    }


    this.updateOrganizer(diagramData, null);
  }

  private updateOrganizer(data: ArchNode | ArchTree, optionCategories: any) {
    this.organizer.clear();

    if (data) {
      const collapseNode = (context: DiagramTreeContext) => {
        if (context.root.children) {
          context.root.children.forEach(child => child.collapse());
        }
      };

      const layoutOptions: LayoutOptions = {
        orientation: Orientation.LeftToRight
      };

      this.organizer.drawArchTreeWithLayout(data, collapseNode, null, layoutOptions);
    }
  }

  private onDoubleClickPonent(node: DiagramTreeNode) {
    this.ngAppViewerService.openNgPonentOnTop(node, PonentActionPurpose.StructureDiagram, this.viewerType);
  }

  private onClickAction(item: PonentActionItem) {
    this.ngAppViewerService.openWindowByPonentAction(item, this.viewerType);
  }
}

