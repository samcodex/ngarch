import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { cloneDeep } from 'lodash-es';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { takeUntilNgDestroy } from 'take-until-ng-destroy';
import { map } from 'rxjs/operators';

import { SvgBoard } from '@core/diagram-impls/diagram-board/svg-board';
import { ArchNgPonent } from '@core/arch-ngponent';
import { DiagramElementFeature } from '@core/diagram/diagram-definition';
import { DiagramOrganizer } from '@core/diagram/diagram-organizer';
import { AnalysisElementType } from '@core/models/analysis-element';
import { UiElementItem } from '@core/models/ui-element-item';
import { d3Element } from '@core/svg/d3-def-types';
import { PonentDiagramDataService } from './data-service/ponent-diagram-data.service';
import { PonentSelectOptionGroup } from './models/ponent-select.model';

const filterItems: UiElementItem[] = [
  { name: 'Module', value: 'module', type: AnalysisElementType.Module, isDisabled: true, isChecked: false },
  { name: 'Component', value: 'component', type: AnalysisElementType.Component, isDisabled: true, isChecked: false },
  { name: 'Service', value: 'service', type: AnalysisElementType.Service, isDisabled: true, isChecked: false },
  { name: 'Directive', value: 'directive', type: AnalysisElementType.Directive, isDisabled: true, isChecked: false },
  { name: 'Pipe', value: 'pipe', type: AnalysisElementType.Pipe, isDisabled: true, isChecked: false }
];

const ponentPath: UiElementItem[] = [];

const panelItems: UiElementItem[] = [
  { name: 'Module', type: AnalysisElementType.Module, tip: 'Module', value: 'NgModule', isDisabled: false, isChecked: true },
  { name: 'Component', type: AnalysisElementType.Component, tip: 'Component', value: 'Component', isDisabled: false, isChecked: true },
  { name: 'Service', type: AnalysisElementType.Service, tip: 'Service', value: 'Injectable', isDisabled: false, isChecked: true },
  { name: 'Other', type: null, tip: 'Directive/Pipe', value: ['Directive', 'Pipe'], isDisabled: false, isChecked: true }
];

@Component({
  selector: 'arch-ponent-diagram',
  templateUrl: './ponent-diagram.component.html',
  styleUrls: [
    './ponent-diagram.component.scss'
  ]
})
export class PonentDiagramComponent implements OnInit, OnDestroy {
  // svg-board
  private nativeElement: HTMLElement;
  private host: d3Element;
  private board: SvgBoard;

  // view-header
  currentPonentPath: UiElementItem[] = ponentPath;
  viewFilterItems: UiElementItem[] = filterItems;

  // panel
  panelPonentFilterItems: UiElementItem[] = panelItems;
  panelPonentItems: PonentSelectOptionGroup[] = [];
  panelSelectedItem: string;
  panelFilterSubject: BehaviorSubject<UiElementItem[]> =
    new BehaviorSubject<UiElementItem[]>(this.panelPonentFilterItems);

  constructor(
    private elementRef: ElementRef,
    private ponentDataService: PonentDiagramDataService,
    private organizer: DiagramOrganizer,
  ) {
    this.organizer.addFeature(DiagramElementFeature.DblClick, this.onDoubleClickPonent.bind(this));
  }

  ngOnInit() {
    this.nativeElement = this.elementRef.nativeElement;
    this.host = d3.select(this.nativeElement.querySelector('#svg-board'));
    this.board = new SvgBoard(this.host);
    this.organizer.setBoard(this.board, true);

    this.initSubscription();
  }

  private initSubscription() {
    combineLatest([
      this.ponentDataService.getPonentsSelectionItems(),
      this.panelFilterSubject.asObservable()
    ])
    .pipe(
      map(([optGroups2, panelFilters]) => {
          const optGroups = cloneDeep(optGroups2);
          const panelFilterItems = [];

          panelFilters
            .filter(item => item.isChecked)
            .forEach(item => {
              const val = item.value;
              if (Array.isArray(val)) {
                panelFilterItems.push.apply(panelFilterItems, val);
              } else {
                panelFilterItems.push(val);
              }
            });

          return optGroups.map(group => {
            group.items = group.items
              .filter(item => item.isDefault || panelFilterItems.includes(item.ngPonentType));
            return group;
          });
        }
      ),
      takeUntilNgDestroy(this)
    )
    .subscribe( data => {
      this.panelPonentItems = data;
      if (!this.panelSelectedItem) {
        this.panelSelectedItem = this.ponentDataService.changePonentSelection().value;
      }
    });

    this.initOrganizer();

    this.ponentDataService.getSelectedPanelItem()
      .pipe(
        takeUntilNgDestroy(this)
      )
      .subscribe( data => {
        this.panelSelectedItem = data.value;
      }
    );
  }

  private initOrganizer() {
    this.ponentDataService.getCurrentArchNgPonents()
      .pipe(
        takeUntilNgDestroy(this)
      )
      .subscribe((data) => {
        this.organizer.clear();
        // const size = this.nativeElement.getBoundingClientRect();
        // this.board.setSize(size.width, size.height);

        if (data) {
          this.organizer.drawArchPonentWithLayout(data);
        }
      }
    );
  }

  ngOnDestroy() {
    this.organizer.clear();
  }

  // @HostListener('window:resize', ['$event'])
  // onSizeChanged(event) {
  //   // const size = this.nativeElement.getBoundingClientRect();
  //   // this.board.setSize(size.width, size.height);
  // }

  private onDoubleClickPonent(item: ArchNgPonent) {
    this.ponentDataService.changePonentSelection(item.name);
  }

  onClickPonentPathItem(item: UiElementItem) {

  }

  onChangeViewFilter(item: UiElementItem) {

  }

  onChangePanelFilter(item: UiElementItem) {
    item.isChecked = !item.isChecked;
    this.panelFilterSubject.next(this.panelPonentFilterItems);
  }

  onChangePanelSelectItem() {
    this.ponentDataService.changePonentSelection(this.panelSelectedItem);
  }

  // onClickInfoForHelp() {

  // }
}
