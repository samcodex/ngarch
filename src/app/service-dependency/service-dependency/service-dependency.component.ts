import { Component, OnInit, ElementRef } from '@angular/core';
import * as d3 from 'd3';

import { ServiceDependencyDataService } from '../services/service-dependency-data.service';
import { d3Element } from '../../core/svg/d3.util';
import { Board } from './../../core/arch-board/board';
import { DiagramOrganizer } from './../../core/diagram/diagram-organizer';

@Component({
  selector: 'arch-service-dependency',
  templateUrl: './service-dependency.component.html',
  styleUrls: ['./service-dependency.component.scss'],
  providers: [
    DiagramOrganizer
  ]
})
export class ServiceDependencyComponent implements OnInit {

  nativeElement: HTMLElement;
  host: d3Element;

  board: Board;

  constructor(
    private elementRef: ElementRef,
    private organizer: DiagramOrganizer,
    private dataService: ServiceDependencyDataService
  ) {
    this.nativeElement = elementRef.nativeElement;
  }

  ngOnInit() {
    this.host = d3.select(this.nativeElement.querySelector('#svg-board'));
    const board = this.board = new Board(this.host);

    this.organizer.setBoard(board);
    this.organizer.start();

    this.dataService.getAllServices().subscribe(this.organizer.appendData.bind(this.organizer));
  }

}
