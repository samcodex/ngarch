import { Observable } from 'rxjs/Observable';
import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/observable/never';
import { IReloadable } from './reloadable.interface';
import { HttpClient } from '@angular/common/http';
import { ArchConfigService } from '../services/arch-config/arch-config.service';
import { ReloadRegisterService } from './reload-register.service';
import { Pausable } from '../../core/pausable';

export class ReloadableLoader extends Pausable implements IReloadable {
  private url: string;
  private http: HttpClient;

  constructor(
    http: HttpClient,
    url: string,
    method: RequestMethod = RequestMethod.Get
  ) {
    super(1);

    this.url = url;
    this.http = http;

    this.initialize(this.fetch());
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

export enum RequestMethod {
  Get = 'Get',
  Post = 'Post'
}
