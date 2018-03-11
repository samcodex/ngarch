import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { ProjectConfig } from '../../../core/models/project-config';
import { ArchConfigService, ArchEndPoints } from '../arch-config/arch-config.service';
import { ReloadRegisterService } from '../../reloadable/reload-register.service';
import { Reloadable } from '../../reloadable/reloadable';

// const url = 'http://localhost:3000/project-config';

@Injectable()
export class ProjectConfigService extends Reloadable {
  private url: string;

  constructor(
    http: HttpClient,
    archConfig: ArchConfigService,
    reloadRegister: ReloadRegisterService
  ) {
    super(http, archConfig, reloadRegister);
  }

  fetch() {
    const url = this.url = this.archConfig.getEndPoint(ArchEndPoints.ProjectConfig);
    return this.http.get(url);
  }

  update(config: ProjectConfig) {
    // const url = this.archConfig.getEndPoint(ArchEndPoints.ProjectConfig);
    this.http.post(this.url, config).subscribe(data => {
      // console.log(data);
    });
  }

}
