import { Component, OnInit, OnDestroy, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { takeUntilNgDestroy } from 'take-until-ng-destroy';
import { combineLatest } from 'rxjs';

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
import { mapArchNodeToDiagramTreeNode } from 'app/ng-app-viewer/models/module-structure-helper';
import { UiElementData } from '@core/models/ui-element-category';
import { ArchViewerOptionsService } from '../app-arch-viewer/services/arch-viewer-options.service';

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

  optionData: UiElementData;
  viewerType = ViewerType.ModuleStructureTree;

  @ViewChild('svgBoard') svgBoardRef: ElementRef;

  constructor(
    elementRef: ElementRef,
    organizer: DiagramOrganizer,
    private ngAppViewerService: NgAppViewerService,
    private viewerDataService: AppViewerDataService,
    private optionsService: ArchViewerOptionsService
  ) {
    super(elementRef, organizer);

    this.organizer.addFeature(DiagramElementFeature.DblClick, this.onDoubleClickPonent.bind(this));
    this.organizer.addFeature(DiagramElementFeature.ActionClick, this.onClickAction.bind(this));
  }

  ngOnInit() {
    super.onInit(this.svgBoardRef);
    this.setBoardMaxSize();
    this.optionData = this.optionsService.getOptionDataForModuleStructure();
    this.setupStream();
  }

  ngOnDestroy() {}

  ngAfterViewInit() {
    super.afterViewInit();
  }

  onExpand(event: { expanded: boolean, delay: number }) {
    const { expanded, delay } = event;
    this.setBoardMaxSize();

    if (!expanded) {
      this.onSizeChanged(true);
    } else {
      setTimeout(this.onSizeChanged.bind(this), delay);
    }
  }

  onDrag(event) {
    this.onSizeChanged();
  }

  onChangeOption(item) {
    const { section, category, option } = item;
    this.optionsService.changeOption(section, category, option);
  }

  onClickViewerExplanation() {
    this.ngAppViewerService.openViewerExplanationPanel(ViewerType.ModuleStructureTree);
  }

  private setBoardMaxSize() {
    const maxSize = d3_util.getElementSize(this.elementRef.nativeElement)();
    this.board.maxSize = { width: maxSize.width, height: maxSize.height };
  }

  private setupStream() {
    const source = combineLatest([
      this.viewerDataService.getStructureTree(),
      this.optionsService.getViewerOrientation()
    ]);

    source
      .pipe(
        takeUntilNgDestroy(this)
      )
      .subscribe( ([archTree, orientation]) => {
        this.updateOrganizer(archTree, orientation);
      });
  }

  private updateOrganizer(data: ArchTree, orientation: Orientation) {
    this.organizer.clear();

    const collapseNode = (context: DiagramTreeContext) => {
      context.root.children.forEach(child => child.isCollapsed = true);
    };

    if (data) {
      const layoutOptions: LayoutOptions = {
        orientation,
        features: [ LayoutFeature.None ],
      };

      this.organizer.drawArchTreeWithLayout(data, collapseNode, mapArchNodeToDiagramTreeNode, layoutOptions);
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
      if (purpose === PonentActionPurpose.ArchitectureView) {
        data = item.data;
      } else if (purpose === PonentActionPurpose.StructureDiagram) {
        const dNode = item.data as DiagramTreeNode;
        data = dNode.archNode;
      }

      this.ngAppViewerService.openWindowByPonentAction(item, this.viewerType);
    }
  }
}
