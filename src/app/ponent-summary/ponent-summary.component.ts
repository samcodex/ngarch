import { Component, OnInit, OnDestroy } from '@angular/core';
import { takeUntilNgDestroy } from 'take-until-ng-destroy';

import { SummarySection, SummaryDetailCategories, SummaryAppCategories } from './models/ponent-summary.model';
import { PonentSummaryService } from './services/ponent-summary.service';

@Component({
  selector: 'arch-ponent-summary',
  templateUrl: './ponent-summary.component.html',
  styleUrls: ['./ponent-summary.component.scss']
})
export class PonentSummaryComponent implements OnInit, OnDestroy {

  summarySections: SummarySection[] = [];
  summaryDetail: SummarySection[] = [];

  constructor(
    private summaryService: PonentSummaryService
  ) { }

  ngOnInit() {
    this.summaryService.getSummaryData()
      .pipe(
        takeUntilNgDestroy(this)
      )
      .subscribe(data => {
        this.summarySections = data.filter(summary => SummaryAppCategories.includes(summary.category));
        this.summaryDetail = data.filter(summary => SummaryDetailCategories.includes(summary.category));
      });
  }

  ngOnDestroy() {}
}
