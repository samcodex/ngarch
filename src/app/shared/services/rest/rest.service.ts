import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { ArchEndPoint, OutputType } from '@config/end-point-definition';
import { util } from '@util/util';
import { ReloadableLoader, ReloadRegisterService } from '../../reloadable';
import { ArchConfigService } from '../arch-config/arch-config.service';

/**
 * Major features: 1) EndPoint config; 2) reloadable
 *
 * @export
 * @class RestService
 */
@Injectable()

export class RestService {

  private loaders: {[url: string]: ReloadableLoader<any>};

  constructor(
    private http: HttpClient,
    private archConfig: ArchConfigService,
    private reloadRegister: ReloadRegisterService
  ) {
    this.loaders = {};
  }

  /**
   * http get method with reloadable feature
   *
   * @param {ArchEndPoint} endPoint
   * @param {boolean} isAutoReload
   * @returns {Observable<any>}
   * @memberof RestService
   */
  getWithReloader<T>(endPoint: ArchEndPoint, isAutoReload = true, trigger_immediate = false): Observable<T> {
    const url = this.archConfig.getEndPoint(endPoint);
    const hash = this.getUrlHashCode(endPoint);
    let loader: ReloadableLoader<T>;

    if (this.loaders.hasOwnProperty(hash)) {
      loader = this.loaders[hash];
    } else {
      this.loaders[hash] = loader = new ReloadableLoader(this.http, url, trigger_immediate);
      if (isAutoReload) {
        this.reloadRegister.register(loader);
      }
    }

    const response = loader.getData()
      .pipe(filter(data => !!data));

    if (endPoint.output === OutputType.Json) {
      return response.pipe(map( (res: any) => JSON.parse(res)));
    } else {
      return response;
    }
  }

  post<T>(endPoint: ArchEndPoint, data: T): Observable<object> {
    const url = this.archConfig.getEndPoint(endPoint);
    const response = this.http.post(url, data);

    return response;
  }

  get(endPoint: ArchEndPoint): Observable<any> {
    const url = this.archConfig.getEndPoint(endPoint);
    return this.http.get(url);
  }

  getLoader(endPoint: ArchEndPoint): ReloadableLoader<any> {
    const hash = this.getUrlHashCode(endPoint);
    let loader = null;

    if (this.loaders.hasOwnProperty(hash)) {
      loader = this.loaders[hash];
    }

    return loader;
  }

  private getUrlHashCode(endPoint: ArchEndPoint): string {
    const url = this.archConfig.getEndPoint(endPoint);
    const hash = 'get_' + util.getHashCode(url);
    return hash;
  }
}
