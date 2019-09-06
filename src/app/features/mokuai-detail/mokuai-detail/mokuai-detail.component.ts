import { Component, ElementRef, OnDestroy, OnInit, HostListener } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import * as d3 from 'd3';
import { mergeMap, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { takeUntilNgDestroy } from 'take-until-ng-destroy';

import { ArchNgPonent } from '@core/arch-ngponent';
import { DiagramElementFeature } from '@core/diagram/diagram-definition';
import { DiagramOrganizer } from '@core/diagram/diagram-organizer';
import { d3Element } from '@core/svg/d3-def-types';
import { convertOptionCategoriesToDiagramOptions, MokuaiOptionCategories } from '../models/mokuai-option-model';
import { PonentMokuaiDataService } from '../services/ponent-mokuai-data.service';
import { PonentMokuaiOptionsService } from '../services/ponent-mokuai-options.service';
import { SvgZoomBoard, SvgBoard } from '@core/diagram-impls/diagram-board';
import { MokuaiContext } from '@ponent-mokuai/models/mokuai-context';
import { Board } from '@core/diagram/board';
import { StarCompositionLayout } from '@core/diagram-impls/diagram-layout/star-composition/star-composition-layout';
import { DiagramLayout } from '@core/diagram/diagram-layout';

@Component({
  selector: 'arch-mokuai-detail',
  templateUrl: './mokuai-detail.component.html',
  styleUrls: ['./mokuai-detail.component.scss'],
  providers: [
    DiagramOrganizer, PonentMokuaiDataService, PonentMokuaiOptionsService
  ]
})
export class MokuaiDetailComponent implements OnInit, OnDestroy {
  // view-header
  selectedPonentPath: string[] = [];
  isPonentsLoading = true;

  // svg-board
  private nativeElement: HTMLElement;
  private host: d3Element;
  private board: Board;
  private context: MokuaiContext;
  private useSvgBoard = false;
  private layout: DiagramLayout;
  private currentToastId: number;

  constructor(
    private elementRef: ElementRef,
    private ponentDataService: PonentMokuaiDataService,
    private organizer: DiagramOrganizer,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.organizer.addFeature(DiagramElementFeature.DblClick, this.onDoubleClickPonent.bind(this));
  }

  get isOverview(): boolean | null {
    return this.context ? this.context.isOverview : null;
  }

  get ponentName(): string | null {
    return this.context ? this.context.viewerId : null;
  }

  ngOnInit() {
    this.nativeElement = this.elementRef.nativeElement;
    this.host = d3.select(this.nativeElement.querySelector('#svg-board'));

    this.setupStream();
  }

  private initBoard(useSvgBoard: boolean) {
    if (!this.board || this.useSvgBoard !== useSvgBoard) {
      if (this.board) {
        this.board.removeRootSvg();
      }

      this.useSvgBoard = useSvgBoard;
      this.board = useSvgBoard ?  new SvgBoard(this.host) : new SvgZoomBoard(this.host);
      this.organizer.setBoard(this.board);
      this.organizer.start();
    }
  }

  private setupStream() {
    // context & selectedPonentPath
    this.ponentDataService.getContext()
      .pipe(
        tap(context => {
          this.context = context;
          this.initBoard(context.useSvgBoard);
          this.changeLayoutWithContext();
        }),
        mergeMap(context => this.ponentDataService.getSelectedPonents()),
        takeUntilNgDestroy(this)
      )
      .subscribe(ponents => {
        this.closeActiveToast();
        this.selectedPonentPath.length = 0;
        this.selectedPonentPath.push.apply(this.selectedPonentPath, ponents);
      });

    // data
    this.ponentDataService.getLatestViewerDataAndOptions()
      .pipe(
        takeUntilNgDestroy(this)
      )
      .subscribe((data: [ ArchNgPonent[], MokuaiOptionCategories, MokuaiContext ]) => {
        this.closeActiveToast();
        const [ ponentData, optionCategories, context ] = data;
        this.initBoard(context.useSvgBoard);
        this.updateOrganizer(ponentData, optionCategories);
      });
  }

  private updateOrganizer(data: ArchNgPonent[], optionCategories: MokuaiOptionCategories) {
     this.isPonentsLoading = true;
    const diagramOption = convertOptionCategoriesToDiagramOptions(optionCategories);
    this.organizer.clear();
    if (data) {
      this.organizer.drawArchPonentWithLayout(data, diagramOption);
    } else {
      this.isPonentsLoading = false;
    }

    if (!this.layout) {
      this.isPonentsLoading = false;
    }
  }

  ngOnDestroy() {
    this.closeActiveToast();
    this.stopLayoutRender();
    this.organizer.clear();
  }

  // TODO
  @HostListener('window:resize', ['$event'])
  onSizeChanged(event) {
    // const size = this.nativeElement.getBoundingClientRect();
    // this.board.setSize(size.width, size.height);
  }

  onClickPonentPathItem(ponentName: string) {
    // this.isPonentsLoading = true;
    const result = this.ponentDataService.popSelectedPonent(ponentName);

    if (!result) {
      // this.isPonentsLoading = false;
    }
  }

  private closeActiveToast() {
    if (this.currentToastId > -1) {
      this.toastr.remove(this.currentToastId);
    }
  }

  private onDoubleClickPonent(item: ArchNgPonent) {
    const ponentName = item.name;

    if (this.isOverview) {
      const url = `analysis-modules/module/${ponentName}`;
      const options: NavigationExtras = {};
      if (this.useSvgBoard) {
        options.queryParams = { board: 'SvgBoard'};
      }
      this.router.navigate([url], options);
    } else {
      this.ponentDataService.appendSelectedPonent(ponentName);
    }
  }

  private changeLayoutWithContext() {
    this.stopLayoutRender();

    this.layout = null;

    if (!this.useSvgBoard) {
      this.layout = new StarCompositionLayout();
      this.layout.isReady()
        .pipe(
          takeUntilNgDestroy(this)
        )
        .subscribe( (layoutReady) => {
          this.isPonentsLoading = !layoutReady;

          this.closeActiveToast();
          this.inactiveCurrentToast();
          if (layoutReady) {
            const activeToast = this.toastr.info('Zoom, Drag and Double Click are available', null, {positionClass: 'toast-bottom-right'});
            this.currentToastId = activeToast.toastId;
            activeToast.onHidden.subscribe(() => this.inactiveCurrentToast());
          }
        });
    }

    this.organizer.setDiagramLayout(this.layout);
  }

  private stopLayoutRender() {
    if (this.layout) {
      this.layout.stopLayout();
    }
  }

  private inactiveCurrentToast() {
    this.currentToastId = -1;
  }
}
