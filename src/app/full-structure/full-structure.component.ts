import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { takeUntilNgDestroy } from 'take-until-ng-destroy';

import { SvgBoard } from '@core/diagram-impls/diagram-board/svg-board';
import { DiagramOrganizer } from '../core/diagram/diagram-organizer';
import { d3Element } from '@core/svg/d3-def-types';
import { ArchNgPonentStore } from '../shared/arch-ngponent-store';

@Component({
  selector: 'arch-full-structure',
  templateUrl: './full-structure.component.html',
  styleUrls: ['./full-structure.component.scss'],
  providers: [
    DiagramOrganizer
  ]
})
export class FullStructureComponent implements OnInit, OnDestroy {
  nativeElement: HTMLElement;
  host: d3Element;

  board: SvgBoard;
  isLoading = true;

  constructor(
    private elementRef: ElementRef,
    private store: ArchNgPonentStore,
    private organizer: DiagramOrganizer
  ) {
    this.nativeElement = elementRef.nativeElement;
  }

  ngOnInit() {
    this.host = d3.select(this.nativeElement.querySelector('#svg-board'));
    const board = this.board = new SvgBoard(this.host);

    this.organizer.setIsDrawLine(false);
    this.organizer.setBoard(board, true);

    this.store.getAllDataFromModuleTypePonents()
      .pipe(
        takeUntilNgDestroy(this)
      )
      .subscribe( data => {
        this.organizer.clear();

        // const size = this.nativeElement.getBoundingClientRect();
        // this.board.setSize(size.width, size.height);

        this.organizer.drawArchPonentWithLayout(data);

        this.isLoading = false;
      });
  }

  ngOnDestroy() {
    this.organizer.clear();
  }
}
