import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { takeUntilNgDestroy } from 'take-until-ng-destroy';

import { SvgBoard } from '@core/diagram-impls/diagram-board/svg-board';
import { DiagramOrganizer } from '@core/diagram/diagram-organizer';
import { d3Element } from '@core/svg/d3-def-types';
import { ArchNgPonentStore } from '@shared/arch-ngponent-store';

@Component({
  selector: 'arch-clazz-diagram',
  templateUrl: './clazz-diagram.component.html',
  styleUrls: ['./clazz-diagram.component.scss'],
  providers: [
    DiagramOrganizer
  ]
})
export class ClazzDiagramComponent implements OnInit, OnDestroy {
  nativeElement: HTMLElement;
  host: d3Element;

  board: SvgBoard;

  constructor(private elementRef: ElementRef,
    private organizer: DiagramOrganizer,
    private dataService: ArchNgPonentStore
  ) {
    this.nativeElement = elementRef.nativeElement;
  }

  ngOnInit() {
    this.host = d3.select(this.nativeElement.querySelector('#svg-board'));
    const board = this.board = new SvgBoard(this.host);

    this.organizer.setBoard(board);
    this.organizer.start();

    this.dataService.getAllModels()
      .pipe(
        takeUntilNgDestroy(this)
      )
      .subscribe(this.organizer.drawArchPonentWithLayout.bind(this.organizer));
  }

  ngOnDestroy() {
    this.organizer.clear();
  }
}
