import {
  AngularCliCommand,
  AngularCliCommandType
} from '../../../../models/angular-cli';

export const AngularCli_V6_Config = [
  {
    command: AngularCliCommandType.Config,
    operand: {
      name: '[key] [value]',
    },
    options: [
      {
        option: 'global',
        alias: 'g',
        description: 'Get/set the value in the global configuration (in your home directory).'
      }
    ]
  }
] as AngularCliCommand[];
