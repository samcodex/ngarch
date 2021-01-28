import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import * as d3 from 'd3';
import { takeUntilNgDestroy } from 'take-until-ng-destroy';

import { ServiceDependencyDataService } from '../services/service-dependency-data.service';
import { d3Element } from '@core/svg/d3-def-types';
import { SvgBoard } from '@core/diagram-impls/diagram-board/svg-board';
import { DiagramOrganizer } from '@core/diagram/diagram-organizer';

@Component({
  selector: 'arch-service-dependency',
  templateUrl: './service-dependency.component.html',
  styleUrls: ['./service-dependency.component.scss'],
  providers: [
    DiagramOrganizer
  ]
})
export class ServiceDependencyComponent implements OnInit, OnDestroy {

  nativeElement: HTMLElement;
  host: d3Element;

  board: SvgBoard;

  constructor(
    private elementRef: ElementRef,
    private organizer: DiagramOrganizer,
    private dataService: ServiceDependencyDataService
  ) {
    this.nativeElement = elementRef.nativeElement;
  }

  ngOnInit() {
    this.host = d3.select(this.nativeElement.querySelector('#svg-board'));
    const board = this.board = new SvgBoard(this.host);

    this.organizer.setBoard(board, true);

    this.dataService.getAllServices()
      .pipe(
        takeUntilNgDestroy(this)
      )
      .subscribe(this.organizer.drawArchPonentWithLayout.bind(this.organizer));
  }

  ngOnDestroy() {}
}
