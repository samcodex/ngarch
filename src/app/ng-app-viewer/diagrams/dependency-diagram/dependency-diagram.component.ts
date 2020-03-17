import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { NgArchUiContentComponent } from 'ng-arch-ui';

import { SvgZoomBoardComponent } from '@core/svg/svg-zoom-board-component';
import { PonentActionItem, PonentActionPurpose, ArchUiDiagramComponent, PonentActionScope } from '../../models/viewer-content-types';
import { ArchNode, ArchTree } from '@core/arch-tree/arch-tree';
import { ArchNgPonent } from '@core/arch-ngponent';
import { ViewerType, DiagramViewerType } from '../../models/ng-app-viewer-definition';
import { ArchViewerHierarchy } from '../../viewers/config/arch-viewer-definition';
import { DiagramOrganizer } from '@core/diagram/diagram-organizer';
import { DiagramTreeNode } from '@core/diagram-tree/diagram-tree-node';
import { NgAppViewerService } from './../../services/ng-app-viewer.service';
import { DiagramElementFeature } from '@core/diagram/diagram-definition';
import { d3_util } from '@core/svg/d3.util';
import { DiagramTreeContext } from '@core/diagram-tree/diagram-tree-context';
import { LayoutOptions, Orientation, DiagramLayoutToken } from '@core/diagram';
import { ArchTreeLayout } from './../../layout/arch-tree-layout/arch-tree-layout';
import { convertArchPonentToDependencyTree } from '@shared/arch-ngponent-store/arch-tree/service-dependency-tree';

const tianDividerWidth = 15;

@Component({
  selector: 'arch-dependency-diagram',
  templateUrl: './dependency-diagram.component.html',
  styleUrls: ['./dependency-diagram.component.scss'],
  providers: [
    DiagramOrganizer,
    { provide: DiagramLayoutToken, useClass: ArchTreeLayout },
  ]
})
export class DependencyDiagramComponent extends SvgZoomBoardComponent
    implements OnInit, OnDestroy, AfterViewInit, NgArchUiContentComponent, ArchUiDiagramComponent {

  data: ArchNode | ArchNgPonent;
  fromViewer: ArchViewerHierarchy | ViewerType | DiagramViewerType;

  viewerType = DiagramViewerType.StructureDiagram;
  @ViewChild('svgBoard', {static: true}) svgBoardRef: ElementRef;

  constructor(
    elementRef: ElementRef,
    organizer: DiagramOrganizer,
    private ngAppViewerService: NgAppViewerService
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

  archOnResize() {
    this.onSizeChanged();
  }

  private setupStream() {
    if (this.data) {
      let archTree = null;
      if (this.data instanceof ArchNode) {
        if (this.data.dependencyArchTree) {
          archTree = this.data.dependencyArchTree;
        } else {
          archTree = convertArchPonentToDependencyTree(this.data.archNgPonent);
          // even setDependencyTree works, should not update the tree model here
          // this.data.setDependencyTree(archTree);
        }
      } else {
        archTree = convertArchPonentToDependencyTree(this.data);
      }

      this.updateOrganizer(archTree, null);
    }
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

  private setBoardMaxSize() {
    const maxSize = d3_util.getElementSize(this.elementRef.nativeElement)();
    this.board.maxSize = { width: maxSize.width - tianDividerWidth, height: maxSize.height };
  }

  private onDoubleClickPonent(node: DiagramTreeNode) {
    this.ngAppViewerService.openNgPonentOnTop(node, PonentActionPurpose.DependencyDiagram, this.viewerType);
  }

  private onClickAction(item: PonentActionItem) {
    if (item.type === PonentActionScope.ComponentAction) {
      this.ngAppViewerService.openWindowByPonentAction(item, this.viewerType);
    }
  }
}
