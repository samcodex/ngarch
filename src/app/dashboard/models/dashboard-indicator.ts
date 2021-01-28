import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DashboardStatus } from './dashboard-status';

@Injectable()
export class DashboardIndicator {
  // strategy = [DashboardStatus.None, DashboardStatus.Closed, DashboardStatus.Half, DashboardStatus.Full];
  strategy = [DashboardStatus.Closed, DashboardStatus.Full];
  indicatorStream = new BehaviorSubject(DashboardStatus.Full);

  isIndicatorOpened(): Observable<boolean> {
    return this.indicatorStream.asObservable()
      .pipe(
        map(indicator => indicator === DashboardStatus.Full)
      );
  }

  next() {
    const indicator = this.indicatorStream.value;
    const index = this.strategy.indexOf(indicator);
    const nextIndex = (index + 1) % this.strategy.length;
    this.indicatorStream.next(this.strategy[nextIndex]);
  }

  close() {
    this.indicatorStream.next(DashboardStatus.Closed);
  }
}
