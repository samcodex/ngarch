import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ArchConfigService } from '../arch-config/arch-config.service';
import { ReloadableLoader, ReloadRegisterService } from './../../reloadable';

@Injectable()
export class RestService {

  private loaders: ReloadableLoader[];

  constructor(
    http: HttpClient,
    archConfig: ArchConfigService,
    reloadRegister: ReloadRegisterService
  ) {
    this.loaders = [];
  }


}
