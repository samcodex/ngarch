import { Component, OnInit, OnDestroy, ElementRef, AfterViewInit, ViewChild, Input } from '@angular/core';
import { combineLatest } from 'rxjs';
import { takeUntilNgDestroy } from 'take-until-ng-destroy';
import { NgArchUiContentComponent } from 'ng-arch-ui';

import { DiagramOrganizer } from '@core/diagram';
import { DiagramLayoutToken } from '@core/diagram/diagram-layout';
import { NgAppViewerService } from '../../services/ng-app-viewer.service';
import { LayoutOptions, Orientation, LayoutFeature, NodeInfoLevel } from '@core/diagram/layout-options';
import { SvgZoomBoardComponent } from '@core/svg/svg-zoom-board-component';
import { ArchTreeLayout } from '../../layout/arch-tree-layout/arch-tree-layout';
import { PonentActionItem, PonentActionPurpose, PonentActionScope, ArchUiDiagramComponent } from '../../models/viewer-content-types';
import { d3_util } from '@core/svg/d3.util';
import { DiagramElementFeature } from '@core/diagram/diagram-definition';
import { UiElementData } from '@core/models/ui-element-category';
import { DiagramTreeNode } from '@core/diagram-tree/diagram-tree-node';
import { ArchViewerNodeType, ArchViewerType, ArchViewerExtraContent } from '../../viewers/config/arch-viewer-definition';
import { filterArchViewerTreeContextWithRoutes } from '../../viewers/app-arch-viewer/services/arch-viewer-tree-context-builder';
import { ArchNode } from '@core/arch-tree/arch-tree';
import { ArchViewerOptionsService } from './../../viewers/app-arch-viewer/services/arch-viewer-options.service';
import { DiagramTreeContext } from '@core/diagram-tree/diagram-tree-context';
import { ArchNgPonentRoute } from '@core/arch-ngponent/arch-ngponent-route';
import { DiagramViewerType, ViewerType } from '../../models/ng-app-viewer-definition';

const tianDividerWidth = 15;
const mapDiagramTreeNode = (node: DiagramTreeNode) => {
  const routeArchNgPonent = node.getRelatedRoutePonent() as ArchNgPonentRoute;
  node.bottomLine = routeArchNgPonent ? routeArchNgPonent.getPath() : null;
};

@Component({
  templateUrl: './activity-diagram.component.html',
  styleUrls: ['./activity-diagram.component.scss'],
  providers: [
    DiagramOrganizer,
    { provide: DiagramLayoutToken, useClass: ArchTreeLayout },
  ]
})
export class ActivityDiagramComponent extends SvgZoomBoardComponent
    implements OnInit, OnDestroy, AfterViewInit, ArchUiDiagramComponent, NgArchUiContentComponent {

  data: ArchNode;
  fromViewer: ViewerType | DiagramViewerType;
  options: any;

  viewerType: DiagramViewerType.ActivityDiagram;
  projectName: string;
  optionData: UiElementData;

  @ViewChild('svgBoard') svgBoardRef: ElementRef;

  constructor(
    elementRef: ElementRef,
    organizer: DiagramOrganizer,
    private ngAppViewerService: NgAppViewerService,
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

  onClickViewerExplanation() {
    this.ngAppViewerService.openViewerExplanationPanel(DiagramViewerType.ActivityDiagram);
  }

  archOnResize() {
    this.onSizeChanged();
  }

  onChangeOption(item) {
    const { section, category, option } = item;
    this.optionsService.changeOption(section, category, option);
  }

  private setBoardMaxSize() {
    const maxSize = d3_util.getElementSize(this.elementRef.nativeElement)();
    this.board.maxSize = { width: maxSize.width - tianDividerWidth, height: maxSize.height };
  }

  private setupStream() {
    const source = combineLatest([
      this.optionsService.getViewerOrientation(),
      this.optionsService.getViewerNodeType(),
      this.optionsService.getViewerType(),
      this.optionsService.getViewerExtraContent()
    ]);

    source
      .pipe(
        takeUntilNgDestroy(this)
      )
      .subscribe( ([ orientation, nodeType, viewerType, extraContent ]) => {
        this.updateOrganizer(orientation, nodeType, viewerType, extraContent);
      });
  }

  private updateOrganizer(orientation: Orientation, nodeType: ArchViewerNodeType,
      viewerType: ArchViewerType, extraContent: ArchViewerExtraContent) {
    this.organizer.clear();

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
        };
      };
      // const traverseTreeContext = nodeType === ArchViewerNodeType.IncludeRoutes
      //   ? null : resetTree;
      const traverseTreeContext = resetTree(nodeType === ArchViewerNodeType.IncludeRoutes);

      this.organizer.drawArchTreeWithLayout(this.data, traverseTreeContext, mapDiagramTreeNode, layoutOptions);
  }

  private onDoubleClickPonent(node: DiagramTreeNode) {
    this.ngAppViewerService.openNgPonentOnTop(node, PonentActionPurpose.RuntimeStructure, this.viewerType);
  }

  private onClickAction(item: PonentActionItem) {
    if (item.value === PonentActionPurpose.ToggleCollapseChildren) {
      const data = item.data as any as DiagramTreeNode;
      data.toggleCollapsedChildrenWhichNoRoutes();
    }

    if (item.type === PonentActionScope.ComponentAction) {
      this.ngAppViewerService.openWindowByPonentAction(item, this.viewerType);
    }
  }
}
