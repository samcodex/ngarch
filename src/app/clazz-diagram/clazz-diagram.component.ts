import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import * as d3 from 'd3';

import { Board } from './../core/arch-board/board';
import { d3Element } from './../core/svg/d3.util';
import { ArchNgPonentStore } from './../shared/services/arch-ngponent-store';
import { DiagramOrganizer } from './../core/diagram/diagram-organizer';

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

  board: Board;

  constructor(private elementRef: ElementRef,
    private organizer: DiagramOrganizer,
    private dataService: ArchNgPonentStore
  ) {
    this.nativeElement = elementRef.nativeElement;
  }

  ngOnInit() {
    this.host = d3.select(this.nativeElement.querySelector('#svg-board'));
    const board = this.board = new Board(this.host);

    this.organizer.setBoard(board);
    this.organizer.start();

    this.dataService.getAllModels().subscribe(this.organizer.appendData.bind(this.organizer));
  }

  ngOnDestroy() {
    this.organizer.clear();
  }
}
