import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ArchNgPonentStore } from '../shared/services/arch-ngponent-store';

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
    this.subscriber = this.store.getRouteData().subscribe( routes => {
      this.routesGroups = routes.map( route => (
        {
          fileName: route.fileName,
          isExpanded: false,
          rawValue: JSON.parse(route.ngPonent.getTsPonent()._rawValue)
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
