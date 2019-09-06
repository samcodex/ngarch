
import {NEVER, ConnectableObservable, Subject, Observable } from 'rxjs';

import {publishReplay, switchMap} from 'rxjs/operators';

export abstract class Pausable<T> {
  private _source: ConnectableObservable<T>;
  private pauser = new Subject<boolean>();
  private replay: number;

  constructor(replay: number) {
    this.replay = replay;
  }

  initialize(source: Observable<T>, wait_for_resume: boolean = false) {
    this._source = this.pauser
      .pipe(
        switchMap<boolean, any>( paused => paused ? NEVER : source),
        publishReplay(this.replay)
      ) as ConnectableObservable<T>;

    this._source.connect();           // begin emitting value
    this.pauser.next(wait_for_resume);
  }

  pause() {
    this.pauser.next(true);
  }

  resume() {
    this.pauser.next(false);
  }

  get source(): Observable<T> {
    return this._source;
  }

}
