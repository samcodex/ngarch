import { AngularCliCommand } from './angular-cli-command';
import { AngularCli } from '.';

export class AngularCliHelper {
  static getSampleCommand(sampleCommand: AngularCliCommand): string {
    const {command, template, operand} = sampleCommand;
    let sample = 'ng ';
    if (command) {
      sample += command + ' ';
    }
    if (template) {
      sample += template + ' ';
    }
    if (operand) {
      sample += operand.name + ' ';
    }
    return sample;
  }

  static listClisVersions(clis: AngularCli[]): string[] {
    return clis.map(cli => cli.version);
  }

  static getCliByVersion(clis: AngularCli[], version: string): AngularCli {
    return clis.find(cli => cli.version === version);
  }

  static getCliByMajorVersion(clis: AngularCli[], major: string): AngularCli {
    return clis.find(cli => cli.workFor.includes(major));
  }

  static getCliByLessMajorVersion(clis: AngularCli[], major: string): AngularCli {
    let found = null;
    let checkMajor = parseInt(major, 10);
    while (!found && checkMajor >= 1) {
      found = clis.find(cli => cli.workFor.includes('' + checkMajor));
      --checkMajor;
    }

    return found;
  }

  static listCliCommands(clis: AngularCli): string[] {
    return clis.commands.map(command => command.command);
  }
}
