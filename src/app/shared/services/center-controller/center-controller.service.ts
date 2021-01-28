import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ReloadRegisterService } from '../../reloadable/reload-register.service';
import { SocketHandlerService } from '../socket-handler/socket-handler.service';

export enum ProjectStatus {
  NONE = 'None',
  UPDATING = 'Updating',
  UPDATED = 'Updated'
}

@Injectable()
export class CenterControllerService {

  private projectStatus: BehaviorSubject<ProjectStatus>;

  constructor(
    private socketHandler: SocketHandlerService,
    private reloadRegister: ReloadRegisterService,
  ) {
    this.projectStatus = new BehaviorSubject<ProjectStatus>(ProjectStatus.NONE);

    this.init();
  }

  private init() {
    this.socketHandler.listen('project_updating').subscribe(() => {
      this.projectStatus.next(ProjectStatus.UPDATING);
    });

    this.socketHandler.listen('project_updated').subscribe(() => {
      this.projectStatus.next(ProjectStatus.UPDATED);

      this.reloadRegister.reload();
    });
  }

  getProjectStatus(): BehaviorSubject<ProjectStatus> {
    return this.projectStatus;
  }

}
