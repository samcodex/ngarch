import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Pausable } from '@core/pausable';
import { IReloadable } from './reloadable.interface';

export class ReloadableLoader<T> extends Pausable<T> implements IReloadable {
  private url: string;
  private http: HttpClient;

  constructor(
    http: HttpClient,
    url: string,
    trigger_immediate: boolean = false
  ) {
    super(1);

    this.url = url;
    this.http = http;

    this.initialize(this.fetch(), !trigger_immediate);
  }

  public reload() {
    this.resume();
  }

  public getData(): Observable<any> {
    return this.source;
  }

  private fetch(): Observable<any> {
    return this.http.get(this.url);
  }
}
