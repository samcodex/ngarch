import { Component, OnInit } from '@angular/core';

import { ArchNgPonentStore, ArchNgPonentLoadingGroup } from './../shared/services/arch-ngponent-store';

@Component({
  selector: 'arch-ponent-summary',
  templateUrl: './ponent-summary.component.html',
  styleUrls: ['./ponent-summary.component.scss']
})
export class PonentSummaryComponent implements OnInit {

  archNgPonentGroups: ArchNgPonentLoadingGroup[] = [];

  constructor(
    private store: ArchNgPonentStore,
  ) { }

  ngOnInit() {
    this.store.getPonentsGroupByLoadingModule().subscribe(data => {
      this.archNgPonentGroups = data;
    });
  }

}
