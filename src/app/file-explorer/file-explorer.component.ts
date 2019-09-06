import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import * as d3 from 'd3';
import { takeUntilNgDestroy } from 'take-until-ng-destroy';

import { ArchNgPonentStore } from '@shared/arch-ngponent-store';
import { d3Element } from '@core/svg/d3-def-types';
import { SvgBoard } from '@core/diagram-impls/diagram-board/svg-board';
import { DiagramOrganizer } from '@core/diagram';
import { NgPonentType } from '@core/ngponent-tsponent';

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

  board: SvgBoard;

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

    this.organizer.setBoard(board, true);
  }

  onClickFileNode(fileName: string) {
    this.store.findPonentsByFileName(fileName)
      .pipe(
        takeUntilNgDestroy(this)
      )
      .subscribe(ponents => {
        const validPonents = ponents.filter(ponent => ponent.ngPonentType !== NgPonentType.Routes);

        this.organizer.clear();
        this.organizer.drawArchPonentWithLayout(validPonents);
      });
  }

  ngOnDestroy() {
    this.organizer.clear();
  }
}
