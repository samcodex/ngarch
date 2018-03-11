import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import * as d3 from 'd3';

import { ArchNgPonentStore } from './../shared/services/arch-ngponent-store/arch-ngponent-store';
import { d3Element } from '../core/svg/d3.util';
import { Board } from '../core/arch-board/board';
import { DiagramOrganizer } from '../core/diagram';
import { NgPonentType } from '../core/ngponent-tsponent';

@Component({
  selector: 'arch-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.scss'],
  providers: [
    DiagramOrganizer
  ]
})
export class FileExplorerComponent implements OnInit, OnDestroy {
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
  }

  onClickFileNode(fileName: string) {
    this.store.findPonentsByFileName(fileName).subscribe(ponents => {
      const validPonents = ponents.filter(ponent => ponent.ngPonentType !== NgPonentType.Route);

      this.organizer.clear();
      this.organizer.appendData(validPonents);
    });
  }

  ngOnDestroy() {
    this.organizer.clear();
  }
}
