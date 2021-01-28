import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Pausable } from '@core/pausable';
import { ArchConfigService } from '../services/arch-config/arch-config.service';
import { ReloadRegisterService } from './reload-register.service';
import { IReloadable } from './reloadable.interface';

/**
 * Should use RestService instead extends this class
 *
 * @export
 * @abstract
 * @class Reloadable
 * @extends {Pausable}
 * @implements {IReloadable}
 */
export abstract class Reloadable<T> extends Pausable<T> implements IReloadable {
  protected http: HttpClient;

  // This property is for the derived class
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
