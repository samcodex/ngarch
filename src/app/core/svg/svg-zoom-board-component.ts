import { ElementRef, HostListener } from '@angular/core';
import * as d3 from 'd3';

import { d3Element } from '@core/svg/d3-def-types';
import { SvgZoomBoard } from '@core/diagram-impls/diagram-board';
import { DiagramOrganizer } from '@core/diagram/diagram-organizer';


export abstract class SvgZoomBoardComponent {

  protected board: SvgZoomBoard;
  protected svgBoardRef: ElementRef;

  constructor(
    protected elementRef: ElementRef,
    protected organizer: DiagramOrganizer
  ) { }

  @HostListener('window:resize', ['$event'])
  onSizeChanged(useMaxSize = false ) {
    this.board.resetSize(-1, -1, false, useMaxSize === true);
  }

  onInit(svgBoardRef: ElementRef) {
    this.svgBoardRef = svgBoardRef;
    const host: d3Element = d3.select(svgBoardRef.nativeElement);
    this.board = new SvgZoomBoard(host);
    this.organizer.setBoard(this.board);
  }

  afterViewInit() {
    this.board.changeBoardSize();
    this.organizer.start();
  }
}
