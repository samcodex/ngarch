import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import * as d3 from 'd3';

import { d3Element } from '../core/svg/d3.util';
import { Board } from '../core/arch-board/board';
import { DiagramOrganizer } from '../core/diagram/diagram-organizer';
import { ArchNgPonentStore } from './../shared/services/arch-ngponent-store/arch-ngponent-store';

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

  board: Board;

  constructor(
    private elementRef: ElementRef,
    private store: ArchNgPonentStore,
    private organizer: DiagramOrganizer
  ) {
    this.nativeElement = elementRef.nativeElement;
  }

  ngOnInit() {
    this.host = d3.select(this.nativeElement.querySelector('#svg-board'));
    const board = this.board = new Board(this.host);

    this.organizer.setBoard(board);
    this.organizer.start();

    this.store.getModuleTypePonents().subscribe( data => {
      this.organizer.clear();

      // const size = this.nativeElement.getBoundingClientRect();
      // this.board.setSize(size.width, size.height);

      this.organizer.appendData(data);
    });
  }

  ngOnDestroy() {
    this.organizer.clear();
  }
}
