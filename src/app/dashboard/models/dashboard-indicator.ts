import { DashboardStatus } from './dashboard-status';

export class DashboardIndicator {
  strategy = [DashboardStatus.None, DashboardStatus.Closed, DashboardStatus.Half, DashboardStatus.Full];
  indicator = DashboardStatus.None;

  get enabled() {
    return this.indicator !== DashboardStatus.None;
  }

  get index() {
    return this.strategy.indexOf(this.indicator);
  }

  next(): DashboardStatus {
    const nextIndex = (this.index + 1) % this.strategy.length;
    return this.indicator = this.strategy[nextIndex];
  }
}
