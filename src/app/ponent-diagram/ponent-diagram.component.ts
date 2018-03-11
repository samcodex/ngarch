import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import * as d3 from 'd3';

import { d3_util, d3Element } from './../core/svg/d3.util';
import { Board } from '../core/arch-board/board';
import { DiagramOrganizer } from './../core/diagram/diagram-organizer';
import { PonentDiagramDataService } from './data-service/ponent-diagram-data.service';
import { DiagramElementFeature } from '../core/diagram';
import { ArchNgPonent } from '../core/arch-ngponent';

@Component({
  selector: 'arch-ponent-diagram',
  templateUrl: './ponent-diagram.component.html',
  styleUrls: [
    './ponent-diagram.component.scss'
  ],
  providers: [ DiagramOrganizer ]
})
export class PonentDiagramComponent implements OnInit, OnDestroy {

  private nativeElement: HTMLElement;
  private host: d3Element;
  private board: Board;

  private subscriber: Subscription;

  constructor(
    private elementRef: ElementRef,
    private ponentDataService: PonentDiagramDataService,
    private organizer: DiagramOrganizer,
  ) {
    this.nativeElement = elementRef.nativeElement;
  }

  ngOnInit() {
    this.host = d3.select(this.nativeElement.querySelector('#svg-board'));
    const board = this.board = new Board(this.host);

    this.organizer.setBoard(board);
    this.organizer.addFeature(DiagramElementFeature.DblClick, this.onDoubleClickPonent.bind(this));
    this.organizer.start();

    this.subscriber = this.ponentDataService.getCurrentArchNgPonents().subscribe((data) => {
      this.organizer.clear();
      // const size = this.nativeElement.getBoundingClientRect();
      // this.board.setSize(size.width, size.height);

      if (data) {
        this.organizer.appendData(data);
      }
    });
  }

  ngOnDestroy() {
    this.organizer.clear();
    this.subscriber.unsubscribe();
  }

  // @HostListener('window:resize', ['$event'])
  // onSizeChanged(event) {
  //   // const size = this.nativeElement.getBoundingClientRect();
  //   // this.board.setSize(size.width, size.height);
  // }

  private onDoubleClickPonent(item: ArchNgPonent) {
    this.ponentDataService.changeSelectedItem(item.name);
  }

}
