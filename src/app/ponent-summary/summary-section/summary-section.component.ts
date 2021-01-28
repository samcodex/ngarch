import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { SummarySection } from '../models/ponent-summary.model';

@Component({
  selector: 'arch-summary-section',
  templateUrl: './summary-section.component.html',
  styleUrls: ['./summary-section.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SummarySectionComponent implements OnInit {

  @Input() section: SummarySection;
  @Input() defaultExpanded: boolean;

  constructor() { }

  ngOnInit() {

  }

}
