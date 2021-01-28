import { Component, OnInit, OnDestroy, ElementRef, AfterViewInit, ViewChild, HostListener, Input } from '@angular/core';
import { takeUntilNgDestroy } from 'take-until-ng-destroy';
import { combineLatest } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  selector: 'arch-module-structure-viewer',
  templateUrl: './module-structure-viewer.component.html',
  styleUrls: ['./module-structure-viewer.component.scss'],
  providers: [
    DiagramOrganizer,
    { provide: DiagramLayoutToken, useClass: ArchTreeLayout },
  ]
})
export class ModuleStructureViewerComponent extends SvgZoomBoardComponent
    implements OnInit, OnDestroy, AfterViewInit {

  @Input()tianLayout = true;
  @Input()initialScale: number;

  optionData: UiElementData;
  viewerType = ViewerType.ModuleStructureTree;

  @ViewChild('svgBoard', {static: true}) svgBoardRef: ElementRef;
  treeName = 'Module Structure';

  constructor(
    elementRef: ElementRef,
    organizer: DiagramOrganizer,
    snackBar: MatSnackBar,
    private ngAppViewerService: NgAppViewerService,
    private viewerDataService: AppViewerDataService,
    private optionsService: ArchViewerOptionsService
  ) {
    super(elementRef, organizer, snackBar);

    this.organizer.addFeature(DiagramElementFeature.DblClick, this.onDoubleClickPonent.bind(this));
    this.organizer.addFeature(DiagramElementFeature.ActionClick, this.onClickAction.bind(this));
  }

  ngOnInit() {
    this.optionData = this.optionsService.getOptionDataForModuleStructure();
  }

  ngOnDestroy() {}

  ngAfterViewInit() {
    if (!this.svgBoardRef) {
      this.svgBoardRef = this.elementRef.nativeElement.querySelector('#svg-board');
    }

    super.onInit(this.svgBoardRef, this.initialScale);
    this.setBoardMaxSize();
    this.setupStream();
    super.afterViewInit();
  }

  @HostListener('window:resize', ['$event'])
  onChangeSize() {
    super.changeSize();
  }

  onExpand(event: { expanded: boolean, delay: number }) {
    const { expanded, delay } = event;
    this.setBoardMaxSize();

    if (!expanded) {
      this.changeSize(true);
    } else {
      setTimeout(this.changeSize.bind(this), delay);
    }
  }

  onDrag(event) {
    this.changeSize();
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
      context.root.children.forEach(child => child.collapse());
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
    if (!this.tianLayout) {
      this.notifyOpenMainDiagramToInteractive();
      return;
    }

    this.ngAppViewerService.openNgPonentOnTop(node, PonentActionPurpose.StructureDiagram, this.viewerType);
  }

  private onClickAction(item: PonentActionItem) {
    if (!this.tianLayout) {
      this.notifyOpenMainDiagramToInteractive();
      return;
    }

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
