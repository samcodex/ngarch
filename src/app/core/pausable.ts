import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

export abstract class Pausable {
  private _source: ConnectableObservable<any>;
  private pauser = new Subject<boolean>();
  private replay: number;

  constructor(replay: number) {
    this.replay = replay;
  }

  initialize(source: Observable<any>, wait_for_resume: boolean = false) {
    this._source = this.pauser
      .switchMap<boolean, any>(
        paused => paused ? Observable.never() : source
      )
      .publishReplay(this.replay);

    this._source.connect();
    this.pauser.next(wait_for_resume);
  }

  pause() {
    this.pauser.next(true);
  }

  resume() {
    this.pauser.next(false);
  }

  get source(): Observable<any> {
    return this._source;
  }

}
