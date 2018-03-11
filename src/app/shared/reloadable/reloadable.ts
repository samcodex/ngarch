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

export abstract class Reloadable extends Pausable implements IReloadable {
  protected http: HttpClient;
  protected archConfig: ArchConfigService;
  protected reloadRegister: ReloadRegisterService;

  constructor(
    http: HttpClient,
    archConfig: ArchConfigService,
    reloadRegister: ReloadRegisterService
  ) {
    super(1);

    this.http = http;
    this.archConfig = archConfig;
    this.reloadRegister = reloadRegister;

    this.reloadRegister.register(this);

    this.initialize(this.fetch());
  }

  public reload() {
    this.resume();
  }

  public getData(): Observable<any> {
    return this.source;
  }

  protected abstract fetch(): Observable<any>;
}
