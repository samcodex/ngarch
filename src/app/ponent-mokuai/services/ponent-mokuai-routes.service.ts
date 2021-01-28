import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ArchNgPonentRoutes } from '@core/arch-ngponent';
import { ArchNgPonentStore } from '@shared/arch-ngponent-store';

@Injectable()
export class PonentMokuaiRoutesService {

  constructor(
    private store: ArchNgPonentStore,
  ) {
  }

  getRouteArchPonentsWithRootModuleId(moduleId): Observable<ArchNgPonentRoutes[]> {
    return this.store.getRouteArchPonentsWithRootModuleId(moduleId);
  }
}
