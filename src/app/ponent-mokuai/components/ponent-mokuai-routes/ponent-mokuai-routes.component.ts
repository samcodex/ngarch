import { Component, OnInit, OnDestroy } from '@angular/core';
import { tap, mergeMap } from 'rxjs/operators';
import { takeUntilNgDestroy } from 'take-until-ng-destroy';

import { ArchNgPonent, ArchNgPonentRoutes } from '@core/arch-ngponent';
import { MokuaiContext } from '@ponent-mokuai/models/mokuai-context';
import { PonentMokuaiRoutesService } from '@ponent-mokuai/services/ponent-mokuai-routes.service';
import { PonentMokuaiContextService } from '@ponent-mokuai/services/ponent-mokuai-context.service';

const overviewName = 'Application';
const archPonentToJson = (archPonent: ArchNgPonentRoutes) => JSON.parse(archPonent.tsPonent._rawValue);

@Component({
  selector: 'arch-ponent-mokuai-routes',
  templateUrl: './ponent-mokuai-routes.component.html',
  styleUrls: ['./ponent-mokuai-routes.component.scss'],
  providers: [ PonentMokuaiRoutesService ]
})
export class PonentMokuaiRoutesComponent implements OnInit, OnDestroy {
  sectionName: string;
  routes: string[] = [];

  constructor(
    private mokuaiContextService: PonentMokuaiContextService,
    private mokuaiRoutesService: PonentMokuaiRoutesService
  ) { }

  ngOnInit() {
    this.mokuaiContextService.getMokuaiContext()
      .pipe(
        tap(
          (mokuaiContext: MokuaiContext) => {
            this.sectionName = mokuaiContext.isOverview ? overviewName : mokuaiContext.viewerId;
          }
        ),
        mergeMap(
          (mokuaiContext: MokuaiContext) =>
            this.mokuaiRoutesService.getRouteArchPonentsWithRootModuleId(mokuaiContext.hostId)
        ),
        takeUntilNgDestroy(this)
      )
      .subscribe((archPonents: ArchNgPonent[]) => {
        this.routes.length = 0;
        if (archPonents && Array.isArray(archPonents) && archPonents.length) {
          archPonents.forEach(archPonent => {
            if (archPonent instanceof ArchNgPonentRoutes) {
              this.routes.push(archPonentToJson(archPonent));
            } else {
              // console.log('???', archPonent);
            }
          });
        }
      });
  }

  ngOnDestroy() {}
}
