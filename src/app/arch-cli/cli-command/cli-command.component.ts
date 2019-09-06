import { Component, OnInit } from '@angular/core';
import { cloneDeep } from 'lodash-es';

import { AngularCliUsage } from '../config/angular-cli-usage';
import { AngularCli, AngularCliCommand, AngularCliHelper, CliOptionPart } from '../models/angular-cli';

@Component({
  selector: 'arch-cli-command',
  templateUrl: './cli-command.component.html',
  styleUrls: ['./cli-command.component.scss']
})
export class CliCommandComponent implements OnInit {

  helper = AngularCliHelper;
  usages = AngularCliUsage;
  versions = new Set<string>();
  commands = new Set<string>();

  selectedVersion: string;
  selectedCommand: string;
  selectedCli: AngularCli;

  currentUsage: AngularCli;
  currentOverview: AngularCliCommand;

  constructor() { }

  ngOnInit() {
    const versions = this.helper.listClisVersions(this.usages);
    this.versions = new Set(versions);
    const [ firstVersion ] = versions;

    this.changeVersion(firstVersion);
  }

  private changeVersion(version: string) {
    this.selectedVersion = version;
    this.selectedCli = this.helper.getCliByVersion(this.usages, version);
    const commands = this.helper.listCliCommands(this.selectedCli);
    this.commands = new Set(commands);
    const [ firstCommand ] = commands;

    this.changeCommand(firstCommand);
  }

  private changeCommand(command) {
    this.selectedCommand = command;
    const commands: AngularCliCommand[] = this.selectedCli.commands;

    this.currentUsage = cloneDeep(this.selectedCli);
    this.currentUsage.commands = commands
      .filter(cliCommand => cliCommand.command === command)
      .map(cliCommand => AngularCliCommand.fromData(cliCommand));
    this.currentOverview = this.currentUsage.overviews.find(overview => overview.command === command);
  }

}
