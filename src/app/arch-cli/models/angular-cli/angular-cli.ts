import { AngularCliCommand } from './angular-cli-command';

export class AngularCli {
  name: string;
  description: string;
  version: string;
  leading?: string;
  workFor?: string[];
  commands: AngularCliCommand[];
  overviews: AngularCliCommand[];
}
