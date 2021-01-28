import { Component, OnInit, OnDestroy, ElementRef, AfterViewInit, ViewChild, HostListener, Input } from '@angular/core';
import { combineLatest, zip, of } from 'rxjs';
import { takeUntilNgDestroy } from 'take-until-ng-destroy';
import { map, mergeMap, distinctUntilChanged, filter } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

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
import { ArchViewerNodeType, ArchViewerType, ArchViewerExtraContent, mapViewerHierarchyToArchTree, ArchViewerHierarchy } from '../config/arch-viewer-definition';
import { DiagramTreeContext } from '@core/diagram-tree/diagram-tree-context';
import { ViewerType } from '../../models/ng-app-viewer-definition';
import { NgPonentType } from '@core/ngponent-tsponent';
import { ArchTreeType } from '@core/arch-tree/arch-tree-definition';
import { disableOrientationLeftToRight, disableExtraContentServiceProvider, disableInjectorAndDependencyHierarchy } from './../config/app-arch-viewer-config';
import { InjectorTreeNode } from '@core/diagram-tree/injector-tree';

const tianDividerWidth = 15;
const mapDiagramTreeNode = (node: DiagramTreeNode) => {
  // the following comment is used to display bottomLine under the child/children of ArchNgPonentRoute,
  // which are ArchNgPonentModule and ArchNgPonentComponent
  // let routeArchNgPonent = node.getRelatedRoutePonent() as ArchNgPonentRoute;
  // if (!routeArchNgPonent) {
  //   const ponent = node.archPonent;
  //   if (ponent.ngPonentType === NgPonentType.Route) {
  //     routeArchNgPonent = ponent as ArchNgPonentRoute;
  //     routeArchNgPonent = routeArchNgPonent.hasComponent
  //       || routeArchNgPonent.hasChildren || routeArchNgPonent.hasLoadChildren ? null : routeArchNgPonent;
  //   }
  // }
  // if (routeArchNgPonent && routeArchNgPonent instanceof ArchNgPonentRoute) {
  //   node.bottomLine = routeArchNgPonent.getShortDescription();
  // }

  if (node.archNode.archNgPonent instanceof ArchNgPonentRoute) {
    node.bottomLine = node.archNode.archNgPonent.getShortDescription();
  }

  node.topLine = node.archNode.getRelatedFromLabel();
};

const hierarchies = [
  {
    id: 'injector',
    name: 'Injector Hierarchy',
    over: false
  },
  {
    id: 'dependency',
    name: 'Dependency Diagram',
    over: false
  }
];

const listNotAllowedHierarchy = [ArchViewerHierarchy.ComponentHierarchy, ArchViewerHierarchy.RoutingHierarchy];
const titlesOfSpecificHierarchy = {
  [ ArchViewerHierarchy.RoutingHierarchy ]: 'Routing Hierarchy',
  [ ArchViewerHierarchy.ComponentHierarchy ]: 'Component Hierarchy'
};
const defaultHeaderTitle = 'Architecture View';

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

  @Input()tianLayout = true;
  @Input()initialScale: number;

  projectName: string;
  optionData: UiElementData;

  viewerType = ViewerType.AppArchViewer;
  contentHierarchy: ArchViewerHierarchy = null;
  headerTitle = defaultHeaderTitle;

  @ViewChild('svgBoard', {static: true}) svgBoardRef: ElementRef;

  hierarchies: any;
  treeName: string;

  constructor(
    elementRef: ElementRef,
    organizer: DiagramOrganizer,
    snackBar: MatSnackBar,
    private ngAppViewerService: NgAppViewerService,
    private viewerDataService: AppViewerDataService,
    private optionsService: ArchViewerOptionsService,
  ) {
    super(elementRef, organizer, snackBar);

    this.organizer.addFeature(DiagramElementFeature.DblClick, this.onDoubleClickPonent.bind(this));
    this.organizer.addFeature(DiagramElementFeature.ActionClick, this.onClickAction.bind(this));
  }

  ngOnInit() {
    this.contentHierarchy = this.ngAppViewerService.getContentHierarchy();
    this.headerTitle = titlesOfSpecificHierarchy[this.contentHierarchy] || defaultHeaderTitle;

    const specificHierarchies = Object.keys(titlesOfSpecificHierarchy);
    const isSpecificHierarchy = specificHierarchies.includes(this.contentHierarchy);
    if (!isSpecificHierarchy) {
      this.hierarchies = hierarchies;
    }

    const optionData = this.optionsService.getOptionDataForRuntimeStructure();
    this.optionData = optionData.filter(element => isSpecificHierarchy ? element.type !== 'hierarchies' : true);
  }
  // ngOnInit() {
  //   super.onInit(this.svgBoardRef);

  //   const specificHierarchies = Object.keys(titlesOfSpecificHierarchy);
  //   this.contentHierarchy = this.ngAppViewerService.getContentHierarchy();
  //   const isSpecificHierarchy = specificHierarchies.includes(this.contentHierarchy);
  //   this.headerTitle = titlesOfSpecificHierarchy[this.contentHierarchy] || defaultHeaderTitle;

  //   if (!isSpecificHierarchy) {
  //     this.hierarchies = hierarchies;
  //   }

  //   this.setBoardMaxSize();

  //   const optionData = this.optionsService.getOptionDataForRuntimeStructure();
  //   this.optionData = optionData.filter(element => isSpecificHierarchy ? element.type !== 'hierarchies' : true);

  //   this.setupStream();
  // }

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
    this.ngAppViewerService.openViewerExplanationPanel(this.contentHierarchy || ViewerType.AppArchViewer);
  }

  private setBoardMaxSize() {
    const maxSize = d3_util.getElementSize(this.elementRef.nativeElement)();
    this.board.maxSize = { width: maxSize.width - tianDividerWidth, height: maxSize.height };
  }

  private setupStream() {
    const treeSource = this.optionsService.getViewerHierarchy()
      .pipe(
        map((hierarchy) => this.contentHierarchy || hierarchy),
        map((hierarchy) => ([hierarchy, mapViewerHierarchyToArchTree(hierarchy)])),
        mergeMap(([hierarchy, treeType]: [ArchViewerHierarchy, ArchTreeType]) => zip(
          of(hierarchy),
          this.viewerDataService.getArchTreeByType(treeType)
        ))
      );

    const source = combineLatest([
      treeSource,
      this.optionsService.getViewerOrientation(),
      // this.optionsService.getViewerNodeType(),
      // this.optionsService.getViewerType(),
      this.optionsService.getViewerExtraContent()
    ]);

    const distinctData = ([ [hierarchy1, data1], ...rest1 ],
                          [ [hierarchy2, data2], ...rest2 ]) => {
      return hierarchy1 === hierarchy2 && rest1.reduce((prev, curr, index) => prev && curr === rest2[index], true);
    };
    source
      .pipe(
        takeUntilNgDestroy(this),
        distinctUntilChanged(distinctData),
        filter(([ [hierarchy, data], orientation, /*nodeType, viewerType,*/ extraContent ]) => {
          // Navigation from Dashboard causes multiple subscribed values changes,
          // This filter avoid trigger multiple times.
          const notAccepted = hierarchy === ArchViewerHierarchy.InjectorHierarchy
            && (orientation === Orientation.LeftToRight
            || extraContent === ArchViewerExtraContent.LayerServiceProvider);
          return !notAccepted;
        })
      )
      .subscribe( ([ [hierarchy, data], orientation, /*nodeType, viewerType,*/ extraContent ]) => {
        setTimeout(() => {
          this.treeName = data.name;
        });

        if (hierarchy === ArchViewerHierarchy.InjectorHierarchy || hierarchy === ArchViewerHierarchy.FullView) {
          const resetOptionAttr = () => {
            disableOrientationLeftToRight(this.optionData, hierarchy === ArchViewerHierarchy.InjectorHierarchy);
            disableExtraContentServiceProvider(this.optionData, hierarchy === ArchViewerHierarchy.InjectorHierarchy);
            disableInjectorAndDependencyHierarchy(this.optionData, orientation === Orientation.LeftToRight
              || extraContent === ArchViewerExtraContent.LayerServiceProvider);
          };
          // setTimeout(resetOptionAttr);
          resetOptionAttr();
        }

        this.updateOrganizer(data, hierarchy, orientation, /*nodeType, viewerType,*/ extraContent);
      });
  }

  private updateOrganizer(data: ArchTree, hierarchy: ArchViewerHierarchy, orientation: Orientation,
      /*nodeType: ArchViewerNodeType, viewerType: ArchViewerType,*/ extraContent: ArchViewerExtraContent) {
    this.organizer.clear();

    if (data) {
      const layoutOptions: LayoutOptions = {
        orientation,
        features: [ ],
        infoLevel: extraContent === ArchViewerExtraContent.LayerServiceProvider ? NodeInfoLevel.Detail : NodeInfoLevel.Basic
      };
      if (hierarchy === ArchViewerHierarchy.InjectorHierarchy) {
        layoutOptions.features.push(LayoutFeature.SecondaryLayerForInjector);
      } else {
        layoutOptions.features.push(LayoutFeature.None);
      }

      // const resetTree = (includeRoutes: boolean) => {
      //   return (treeContext: DiagramTreeContext) => {
      //     if (!includeRoutes) {
      //       filterArchViewerTreeContextWithRoutes(treeContext);
      //     }
      //     // TODO, should not use [0] here, remember that this function(collapse all Routes' children) is finished. Please check if or not.)
      //     if (Array.isArray(treeContext.root.children) && treeContext.root.children[0]) {
      //       treeContext.root.children[0].toggleCollapsedChildrenWhichNoRoutes();
      //     }
      //   };
      // };
      // const traverseTreeContext = resetTree(nodeType === ArchViewerNodeType.IncludeRoutes);
      const traverseTreeContext = null;

      this.organizer.drawArchTreeWithLayout(data, traverseTreeContext, mapDiagramTreeNode, layoutOptions);
    }
  }

  private onDoubleClickPonent(node: DiagramTreeNode | InjectorTreeNode) {
    if (!this.tianLayout) {
      this.notifyOpenMainDiagramToInteractive();
      return;
    }

    if (node instanceof DiagramTreeNode) {
      this.ngAppViewerService.openNgPonentOnTop(node, PonentActionPurpose.ArchitectureView, this.viewerType);
    } else if (node instanceof InjectorTreeNode) {
      if (node.isProviderNode) {
        this.ngAppViewerService.openNgPonentOnTop(node, PonentActionPurpose.DependencyDiagram, this.viewerType);
      }
    }
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
      }
      this.ngAppViewerService.openWindowByPonentAction(item, this.viewerType);
    }
  }
}
