import { Component, OnInit, OnDestroy, ElementRef, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
import { NgArchUiContentComponent } from 'ng-arch-ui';

import { ArchNgPonent } from '@core/arch-ngponent';
import { d3Element } from '@core/svg/d3-def-types';
import { DiagramOrganizer } from '@core/diagram';
import { DiagramLayout } from '@core/diagram/diagram-layout';
import { MokuaiOptionCategories } from '@features/mokuai-detail/models/mokuai-option-model';
import { SvgBoard } from '@core/diagram-impls/diagram-board';
import { d3_util } from '@core/svg/d3.util';
import { ArchUiDiagramComponent } from '../../models/viewer-content-types';
import { ArchNode } from '@core/arch-tree/arch-tree';
import { ViewerType, DiagramViewerType } from '../../models/ng-app-viewer-definition';

@Component({
  template: '<div #svgBoard id="svg-board"></div>',
  styleUrls: ['./class-visualizer.component.scss'],
  providers: [
    DiagramOrganizer
  ]
})
export class ClassVisualizerComponent implements OnInit, AfterViewInit, OnDestroy,
    NgArchUiContentComponent, ArchUiDiagramComponent {
  data: ArchNode | ArchNgPonent;
  fromViewer: ViewerType | DiagramViewerType;

  private host: d3Element;
  private board: SvgBoard;
  private layout: DiagramLayout;

  constructor(
    private elementRef: ElementRef,
    private organizer: DiagramOrganizer,
  ) { }

  ngOnInit() {
    this.host = d3.select(this.elementRef.nativeElement.querySelector('#svg-board'));

    this.initBoard();
  }

  ngOnDestroy() {

  }

  ngAfterViewInit() {
    const size = d3_util.getRectDimension(this.host);
    const size2 = (this.host.node() as any).getBoundingClientRect();

    // console.log('size, ', size);
    // console.log('size2 - height', size2.height);
    this.board.setSize(size.width, size.height - 210);
    const archNgPonent: ArchNgPonent = this.data instanceof ArchNgPonent ? this.data : this.data.archNgPonent;

    this.updateOrganizer([archNgPonent], null);
  }

  archOnResize(wrapperWindow) {
    // console.log(wrapperWindow);
    const svgContainer = this.elementRef.nativeElement.querySelector('#svg-board');
    const size1 = svgContainer.getBoundingClientRect();
    // const size = this.elementRef.nativeElement.getBoundingClientRect();

    const size = wrapperWindow.size;
    this.board.setSize(size.width, size.height);
  }

  private initBoard() {
    this.board = new SvgBoard(this.host);
    this.organizer.setBoard(this.board);
    this.organizer.start();
  }

  private updateOrganizer(data: ArchNgPonent[], optionCategories: MokuaiOptionCategories) {
    const diagramOption = null; // convertOptionCategoriesToDiagramOptions(optionCategories);

    this.organizer.clear();
    if (data) {
      this.organizer.drawArchPonentWithLayout(data, diagramOption);
    }
  }
}

