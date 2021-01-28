import { Component, OnInit, OnDestroy } from '@angular/core';
import { takeUntilNgDestroy } from 'take-until-ng-destroy';

import { SocketHandlerService } from '@shared/services/socket-handler/socket-handler.service';
import { ProjectProfileService, ProjectConfig } from '@shared/project-profile';

const socketServer = 'cli_exec';
const socketClient = 'cli_exec_result';

@Component({
  selector: 'arch-generic-cli-exec',
  templateUrl: './generic-cli-exec.component.html',
  styleUrls: ['./generic-cli-exec.component.scss']
})
export class GenericCliExecComponent implements OnInit, OnDestroy {

  execResult: any;
  command = '';
  projectConfig: ProjectConfig;
  isExecuting = false;

  constructor(
    private socketHandler: SocketHandlerService,
    private profileService: ProjectProfileService
  ) { }

  ngOnInit() {
    this.socketHandler.listen(socketClient).subscribe(result => {
      this.execResult = result;
      this.isExecuting = false;
    });

    this.profileService.getProjectConfig()
      .pipe(
        takeUntilNgDestroy(this)
      )
      .subscribe(config => {
        this.projectConfig = config;
      });
  }

  ngOnDestroy() {}

  executeCommand() {
    if (this.command) {
      this.isExecuting = true;
      this.socketHandler.send(socketServer, this.command);
    }
  }

}
