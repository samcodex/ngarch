import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { takeUntilNgDestroy } from 'take-until-ng-destroy';

import { ArchNgPonentStore } from '@shared/arch-ngponent-store';

@Component({
  selector: 'arch-routing-structure',
  templateUrl: './routing-structure.component.html',
  styleUrls: ['./routing-structure.component.scss']
})
export class RoutingStructureComponent implements OnInit, OnDestroy {

  routesGroups: RoutesGroup[];
  subscriber: Subscription;

  constructor(
    private store: ArchNgPonentStore
  ) { }

  ngOnInit() {
    this.subscriber = this.store.getRouteData()
      .pipe(
        takeUntilNgDestroy(this)
      )
      .subscribe( routes => {
        this.routesGroups = routes.map( route => (
          {
            fileName: route.fileName,
            isExpanded: false,
            rawValue: JSON.parse(route.tsPonent._rawValue)
          }
        ));
      });
  }

  ngOnDestroy() {
    this.subscriber.unsubscribe();
  }

}

interface RoutesGroup {
  fileName: string;
  isExpanded: boolean;
  rawValue: string;
}
