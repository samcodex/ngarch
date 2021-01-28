import { Component, OnInit } from '@angular/core';
import { cloneDeep } from 'lodash-es';

import { AngularCliUsage } from '../../../arch-cli/config/angular-cli-usage';
import { AngularCliHelper as cliHelper, AngularCli, AngularCliCommand } from '../../../arch-cli/models/angular-cli';
import { ArchNgPonent } from '@core/arch-ngponent';
import { ProjectProfileService } from '@shared/project-profile';
import { getDependencyVersion } from '@core/models/arch-project';
import { ArchUiDiagramComponent } from '../../models/viewer-content-types';
import { ArchNode } from '@core/arch-tree/arch-tree';
import { ViewerType, DiagramViewerType } from '../../models/ng-app-viewer-definition';

@Component({
  templateUrl: './ponent-cli.component.html',
  styleUrls: ['./ponent-cli.component.scss']
})
export class PonentCliComponent implements OnInit, ArchUiDiagramComponent {
  data: ArchNode;
  fromViewer: ViewerType | DiagramViewerType;

  private archNgPonent: ArchNgPonent;

  workingDirectory: string;

  usages = AngularCliUsage;

  currentCli: AngularCli;
  commands: AngularCliCommand[];
  selectedCommandIndex: number;
  selectedCommand: AngularCliCommand;

  expectedVersion: number;
  usedVersion: number;

  constructor(
    private profileService: ProjectProfileService
  ) { }

  ngOnInit() {
    this.archNgPonent = this.data.archNgPonent;

    this.profileService.getProjectInfo()
      .subscribe(projectInfo => {
        const angular = getDependencyVersion(projectInfo, 'angular');
        const { major } = angular;
        this.expectedVersion = major;

        if (this.archNgPonent && this.archNgPonent.angularFilePath) {
          this.workingDirectory = this.archNgPonent.angularFilePath.directoryOfApp;
        } else {
          this.workingDirectory = '';
        }

        this.initCli('' + major);
      });
  }

  selectCommand(index: number) {
    this.selectedCommandIndex = index;
    this.selectedCommand = this.commands[index];

    const path = this.workingDirectory;
    if (this.selectedCommand.operand && path) {
      this.selectedCommand.operand.name = path + '/' + this.selectedCommand.operand.name ;
    }
  }

  applyOption(option) {

  }

  private initCli(version: string) {
    let cli = cliHelper.getCliByMajorVersion(this.usages, version);
    if (!cli) {
      cli = cliHelper.getCliByLessMajorVersion(this.usages, version);
    }

    if (cli) {
      this.usedVersion = parseInt(cli.version.split('.')[0], 10);
      const commands: AngularCliCommand[] = cli.commands;

      this.currentCli = cloneDeep(cli);
      this.commands = this.currentCli.commands = commands
        .filter(command => command.allowExecute)
        .map(AngularCliCommand.fromData);
    }

  }
}
