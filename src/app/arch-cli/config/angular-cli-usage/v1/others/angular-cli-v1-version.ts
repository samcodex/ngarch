import {
  AngularCliCommand,
  AngularCliCommandType
} from '../../../../models/angular-cli';

export const AngularCli_V1_Version = [
  {
    command: AngularCliCommandType.Version,
    description: 'Display Angular Cli and Application Version',
    commandAlias: 'v',
    allowExecute: true,
  }
] as AngularCliCommand[];
