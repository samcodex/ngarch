import {
  AngularCliCommand,
  AngularCliCommandType
} from '../../../../models/angular-cli';

export const AngularCli_V6_Xi18n: AngularCliCommand[] = [
  {
    command: AngularCliCommandType.Xi18n,
    description: 'Extracts i18n messages from the templates.',
    operand: {
      name: '[project]',
    },
    options: [
      {
        option: 'configuration',
        alias: 'c',
        description: 'Specify the configuration to use.'
      },
      {
        option: 'browser-target',
        description: 'Target to extract from'
      },
      {
        option: 'i18n-format',
        description: 'Output format for the generated file.'
      },
      {
        option: 'i18n-local',
        description: 'Specifies the source language of the application.'
      },
      {
        option: 'output-path',
        description: 'Path where output will be placed.'
      },
      {
        option: 'output-file',
        description: 'Name of the file to output.'
      }
    ]
  }
];
