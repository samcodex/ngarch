import { ElementRef, HostListener } from '@angular/core';
import * as d3 from 'd3';
import { MatSnackBar } from '@angular/material/snack-bar';

import { d3Element } from '@core/svg/d3-def-types';
import { SvgZoomBoard } from '@core/diagram-impls/diagram-board';
import { DiagramOrganizer } from '@core/diagram/diagram-organizer';


export abstract class SvgZoomBoardComponent {

  protected board: SvgZoomBoard;
  protected svgBoardRef: ElementRef;

  constructor(
    protected elementRef: ElementRef,
    protected organizer: DiagramOrganizer,
    protected snackBar?: MatSnackBar
  ) { }

  abstract onChangeSize();

  changeSize(useMaxSize = false ) {
    this.board.resetSize(-1, -1, false, useMaxSize === true);
  }

  onInit(svgBoardRef: ElementRef, initialScale?: number) {
    this.svgBoardRef = svgBoardRef;
    // const host: d3Element = d3.select(svgBoardRef.nativeElement);
    const host: d3Element = svgBoardRef instanceof ElementRef ? d3.select(svgBoardRef.nativeElement) : d3.select(svgBoardRef as any);
    this.board = new SvgZoomBoard(host, initialScale);
    this.organizer.setBoard(this.board);
  }

  afterViewInit() {
    this.board.changeBoardSize();
    this.organizer.start();
  }

  notifyOpenMainDiagramToInteractive() {
    if (this.snackBar) {
      this.snackBar.open('Use main diagram to interactive', '', {
        duration: 2000,
        panelClass: ['mat-toolbar', 'mat-accent'],
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
    }
  }
}
