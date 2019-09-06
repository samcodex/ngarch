import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { takeUntilNgDestroy } from 'take-until-ng-destroy';

import { ProjectConfig, ProjectProfileService } from '@shared/project-profile';
import { SocketHandlerService } from '@shared/services/socket-handler/socket-handler.service';
import { AngularCliCommand } from '../../../../arch-cli/models/angular-cli';

const socketServer = 'cli_exec';
const socketClient = 'cli_exec_result';

@Component({
  selector: 'arch-cli-execution',
  templateUrl: './cli-execution.component.html',
  styleUrls: ['./cli-execution.component.scss']
})
export class CliExecutionComponent implements OnInit, OnDestroy {
  execResult: any;
  projectConfig: ProjectConfig;
  isExecuting = false;

  constructor(
    private socketHandler: SocketHandlerService,
    private profileService: ProjectProfileService,
    public dialogRef: MatDialogRef<CliExecutionComponent>,
    @Inject(MAT_DIALOG_DATA) public command: AngularCliCommand
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
    this.isExecuting = true;
    const cli = this.command.getCommandLine();
    this.socketHandler.send(socketServer, cli);
  }

  getCommandLine() {
    return this.command.getCommandLine();
  }
}
