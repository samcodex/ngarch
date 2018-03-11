import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { ArchConfigService, ArchEndPoints } from '../arch-config/arch-config.service';
import { Reloadable } from '../../reloadable/reloadable';
import { ReloadRegisterService } from '../../reloadable/reload-register.service';

// const url = 'http://localhost:3000/project-files';

@Injectable()
export class ProjectFilesService extends Reloadable {
  private url: string;

  constructor(
    http: HttpClient,
    archConfig: ArchConfigService,
    reloadRegister: ReloadRegisterService
  ) {
    super(http, archConfig, reloadRegister);
  }

  protected fetch(): Observable<any> {
    const url = this.url = this.archConfig.getEndPoint(ArchEndPoints.ProjectFiles);
    return this.http.get(url).map( (files: any) => JSON.parse(files));
  }

}
