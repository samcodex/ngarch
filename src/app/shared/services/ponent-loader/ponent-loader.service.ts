import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as CircularJSON from 'circular-json';

import { Observable } from 'rxjs/Observable';
import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/observable/never';

import { Ponent, TsPonent, NgPonent } from './../../../core/ngponent-tsponent';
import { Deserializable } from '../../../core/serialization';
import { ArchConfigService, ArchEndPoints } from '../arch-config/arch-config.service';
import { Reloadable } from '../../reloadable/reloadable';
import { ReloadRegisterService } from '../../reloadable/reload-register.service';

// const url = 'http://localhost:3000/ngarch';


@Injectable()
export class PonentLoaderService extends Reloadable {
  private url: string;

  constructor(
    http: HttpClient,
    archConfig: ArchConfigService,
    reloadRegister: ReloadRegisterService
  ) {
    super(http, archConfig, reloadRegister);
  }

  protected fetch(): Observable<Ponent[]> {
    const url = this.url = this.archConfig.getEndPoint(ArchEndPoints.NgArch);
    return this.http.get(url).map(this.parseResponse);
  }

  private parseResponse(response): Ponent[] {

    const obj = CircularJSON.parse(response);
    // console.log('--- service start---');
    // console.log('response(json) ==> ', response);
    // console.log('response(object) ==> ', obj);

    const ponents = obj.map(element => {
      // console.log(element);
      if ('$clazz' in element) {
        const clazz = element.$clazz;
        let instance: TsPonent | NgPonent;

        if (clazz === 'NgPonent') {
          instance =  new NgPonent();
          instance.fromJson(element);
          // console.log(instance);

          return instance;
        } else if (clazz === 'TsPonent') {
          instance =  new TsPonent();
          instance.fromJson(element);
          // console.log(instance);

          return instance;
        }
      }
    });

    // console.log('--- Expectation ---', ponents);

    // console.log('--- service[end] ---');

    return ponents;
  }

}
