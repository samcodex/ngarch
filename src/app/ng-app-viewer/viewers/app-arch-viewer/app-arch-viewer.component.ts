import { Component, OnInit, OnDestroy, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { combineLatest } from 'rxjs';
import { takeUntilNgDestroy } from 'take-until-ng-destroy';

import { DiagramOrganizer } from '@core/diagram';
import { DiagramLayoutToken } from '@core/diagram/diagram-layout';
import { NgAppViewerService } from '../../services/ng-app-viewer.service';
import { LayoutOptions, Orientation, LayoutFeature, NodeInfoLevel } from '@core/diagram/layout-options';
import { SvgZoomBoardComponent } from '@core/svg/svg-zoom-board-component';
import { ArchTreeLayout } from '../../layout/arch-tree-layout/arch-tree-layout';
import { PonentActionItem, PonentActionPurpose, PonentActionScope } from '../../models/viewer-content-types';
import { AppViewerDataService } from './../../services/app-viewer-data.service';
import { d3_util } from '@core/svg/d3.util';
import { ArchTree } from '@core/arch-tree/arch-tree';
import { DiagramElementFeature } from '@core/diagram/diagram-definition';
import { ArchViewerOptionsService } from './services/arch-viewer-options.service';
import { UiElementData } from '@core/models/ui-element-category';
import { filterArchViewerTreeContextWithRoutes } from './services/arch-viewer-tree-context-builder';
import { DiagramTreeNode } from '@core/diagram-tree/diagram-tree-node';
import { ArchNgPonentRoute } from '@core/arch-ngponent/arch-ngponent-route';
import { ArchViewerNodeType, ArchViewerType, ArchViewerExtraContent } from '../config/arch-viewer-definition';
import { DiagramTreeContext } from '@core/diagram-tree/diagram-tree-context';
import { ViewerType } from 'app/ng-app-viewer/models/ng-app-viewer-definition';

const tianDividerWidth = 15;
const mapDiagramTreeNode = (node: DiagramTreeNode) => {
  const routeArchNgPonent = node.getRelatedRoutePonent() as ArchNgPonentRoute;
  node.bottomLine = routeArchNgPonent ? routeArchNgPonent.getPath() : null;
};

@Component({
  templateUrl: './app-arch-viewer.component.html',
  styleUrls: ['./app-arch-viewer.component.scss'],
  providers: [
    DiagramOrganizer,
    ArchViewerOptionsService,
    { provide: DiagramLayoutToken, useClass: ArchTreeLayout },
  ]
})
export class AppArchViewerComponent extends SvgZoomBoardComponent
    implements OnInit, OnDestroy, AfterViewInit {

  projectName: string;
  optionData: UiElementData;

  viewerType = ViewerType.AppArchViewer;
  @ViewChild('svgBoard') svgBoardRef: ElementRef;

  constructor(
    elementRef: ElementRef,
    organizer: DiagramOrganizer,
    private ngAppViewerService: NgAppViewerService,
    private viewerDataService: AppViewerDataService,
    private optionsService: ArchViewerOptionsService,
  ) {
    super(elementRef, organizer);

    this.organizer.addFeature(DiagramElementFeature.DblClick, this.onDoubleClickPonent.bind(this));
    this.organizer.addFeature(DiagramElementFeature.ActionClick, this.onClickAction.bind(this));
  }

  ngOnInit() {
    super.onInit(this.svgBoardRef);

    this.setBoardMaxSize();
    this.optionData = this.optionsService.getOptionData();

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

  onChangeOption(item) {
    const { section, category, option } = item;
    this.optionsService.changeOption(section, category, option);
  }

  onClickViewerExplanation() {
    this.ngAppViewerService.openViewerExplanationPanel(ViewerType.AppArchViewer);
  }

  private setBoardMaxSize() {
    const maxSize = d3_util.getElementSize(this.elementRef.nativeElement)();
    this.board.maxSize = { width: maxSize.width - tianDividerWidth, height: maxSize.height };
  }

  private setupStream() {
    const source = combineLatest([
      this.viewerDataService.getRouteTree(),
      this.optionsService.getViewerOrientation(),
      this.optionsService.getViewerNodeType(),
      this.optionsService.getViewerType(),
      this.optionsService.getViewerExtraContent()
    ]);

    source
      .pipe(
        takeUntilNgDestroy(this)
      )
      .subscribe( ([ data, orientation, nodeType, viewerType, extraContent ]) => {
        this.updateOrganizer(data, orientation, nodeType, viewerType, extraContent);
      });
  }

  private updateOrganizer(data: ArchTree, orientation: Orientation, nodeType: ArchViewerNodeType,
      viewerType: ArchViewerType, extraContent: ArchViewerExtraContent) {
    this.organizer.clear();

    if (data) {
      const layoutOptions: LayoutOptions = {
        orientation,
        features: [ LayoutFeature.None ],
        infoLevel: extraContent === ArchViewerExtraContent.LayerServiceProvider ? NodeInfoLevel.Detail : NodeInfoLevel.Basic
      };
      const resetTree = (includeRoutes: boolean) => {
        return (treeContext: DiagramTreeContext) => {
          if (!includeRoutes) {
            filterArchViewerTreeContextWithRoutes(treeContext);
          }
          // TODO, should not use [0] here, remember that this function(collapse all Routes' children) is finished. Please check if or not.)
          if (Array.isArray(treeContext.root.children) && treeContext.root.children[0]) {
            treeContext.root.children[0].toggleCollapsedChildrenWhichNoRoutes();
          }
        };
      };
      // const traverseTreeContext = nodeType === ArchViewerNodeType.IncludeRoutes
      //   ? null : resetTree;
      const traverseTreeContext = resetTree(nodeType === ArchViewerNodeType.IncludeRoutes);

      this.organizer.drawArchTreeWithLayout(data, traverseTreeContext, mapDiagramTreeNode, layoutOptions);
    }
  }

  private onDoubleClickPonent(node: DiagramTreeNode) {
    this.ngAppViewerService.openNgPonentOnTop(node, PonentActionPurpose.ActivityDiagram, this.viewerType);
  }

  private onClickAction(item: PonentActionItem) {
    const purpose: PonentActionPurpose = item.value;

    if (purpose === PonentActionPurpose.ToggleCollapseChildren) {
      const data = item.data as any as DiagramTreeNode;
      data.toggleCollapsedChildrenWhichNoRoutes();
    }

    if (item.type === PonentActionScope.ComponentAction) {
      let data;
      if (purpose === PonentActionPurpose.ActivityDiagram) {
        data = item.data;
      }
      this.ngAppViewerService.openWindowByPonentAction(item, this.viewerType);
    }
  }
}
