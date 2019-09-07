import { Component, OnInit, OnDestroy, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { takeUntilNgDestroy } from 'take-until-ng-destroy';

import { DiagramOrganizer } from '@core/diagram';
import { DiagramLayoutToken } from '@core/diagram/diagram-layout';
import { NgAppViewerService } from '../../services/ng-app-viewer.service';
import { LayoutOptions, Orientation, LayoutFeature, NodeInfoLevel } from '@core/diagram/layout-options';
import { SvgZoomBoardComponent } from '@core/svg/svg-zoom-board-component';
import { ArchTreeLayout } from '../../layout/arch-tree-layout/arch-tree-layout';
import { PonentActionItem, PonentActionPurpose, PonentActionScope } from '../../models/viewer-content-types';
import { d3_util } from '@core/svg/d3.util';
import { ArchTree, ArchNode } from '@core/arch-tree/arch-tree';
import { DiagramElementFeature } from '@core/diagram/diagram-definition';
import { DiagramTreeNode } from '@core/diagram-tree/diagram-tree-node';
import { AppViewerDataService } from '../../services/app-viewer-data.service';
import { DiagramTreeContext } from '@core/diagram-tree/diagram-tree-context';
import { ViewerType } from '../../models/ng-app-viewer-definition';

@Component({
  templateUrl: './module-structure-viewer.component.html',
  styleUrls: ['./module-structure-viewer.component.scss'],
  providers: [
    DiagramOrganizer,
    { provide: DiagramLayoutToken, useClass: ArchTreeLayout },
  ]
})
export class ModuleStructureViewerComponent extends SvgZoomBoardComponent
    implements OnInit, OnDestroy, AfterViewInit {

  viewerType = ViewerType.ModuleStructureTree;

  @ViewChild('svgBoard') svgBoardRef: ElementRef;

  constructor(
    elementRef: ElementRef,
    organizer: DiagramOrganizer,
    private ngAppViewerService: NgAppViewerService,
    private viewerData: AppViewerDataService
  ) {
    super(elementRef, organizer);

    this.organizer.addFeature(DiagramElementFeature.DblClick, this.onDoubleClickPonent.bind(this));
    this.organizer.addFeature(DiagramElementFeature.ActionClick, this.onClickAction.bind(this));
  }

  ngOnInit() {
    super.onInit(this.svgBoardRef);
    this.setBoardMaxSize();
    this.setupStream();
  }

  ngOnDestroy() {}

  ngAfterViewInit() {
    super.afterViewInit();
  }

  onExpand(event: { expanded: boolean, delay: number }) {
    const { expanded, delay } = event;

    if (!expanded) {
      this.onSizeChanged(true);
    } else {
      setTimeout(this.onSizeChanged.bind(this), delay);
    }
  }

  onDrag(event) {
    this.onSizeChanged();
  }

  private setBoardMaxSize() {
    const maxSize = d3_util.getElementSize(this.elementRef.nativeElement)();
    this.board.maxSize = { width: maxSize.width, height: maxSize.height };
  }

  private setupStream() {
    const source = this.viewerData.getStructureTree();

    source
      .pipe(
        takeUntilNgDestroy(this)
      )
      .subscribe( (archTree) => {
        this.updateOrganizer(archTree);
      });
  }

  private updateOrganizer(data: ArchTree) {
    this.organizer.clear();

    const collapseNode = (context: DiagramTreeContext) => {
      context.root.children.forEach(child => child.isCollapsed = true);
    };

    const orientation = Orientation.TopToBottom;
    if (data) {
      const layoutOptions: LayoutOptions = {
        orientation,
        features: [ LayoutFeature.None ],
      };

      this.organizer.drawArchTreeWithLayout(data, collapseNode, null, layoutOptions);
    }
  }

  private onDoubleClickPonent(node: DiagramTreeNode) {
    this.ngAppViewerService.openNgPonentOnTop(node, PonentActionPurpose.StructureDiagram, this.viewerType);
  }

  private onClickAction(item: PonentActionItem) {
    const purpose: PonentActionPurpose = item.value;

    if (purpose === PonentActionPurpose.ToggleCollapseChildren) {
      const data = item.data as any as DiagramTreeNode;
      data.toggleCollapsedChildrenWhichNoRoutes();
    }

    if (item.type === PonentActionScope.ComponentAction) {
      let data;
      if (purpose === PonentActionPurpose.RuntimeStructure) {
        data = item.data;
      } else if (purpose === PonentActionPurpose.StructureDiagram) {
        const dNode = item.data as DiagramTreeNode;
        data = dNode.archNode;
      }

      this.ngAppViewerService.openWindowByPonentAction(item, this.viewerType);
    }
  }
}
