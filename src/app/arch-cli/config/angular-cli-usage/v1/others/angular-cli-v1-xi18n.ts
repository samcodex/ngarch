import {
  AngularCliCommand,
  AngularCliCommandType
} from '../../../../models/angular-cli';
import { MetaDataType } from '@config/meta-config';

export const AngularCli_V1_Xi18n = [
  {
    command: AngularCliCommandType.Xi18n,
    description: 'Extracts i18n messages from the templates.',
    operand: {
      name: '[project]',
    },
    options: [
      {
        option: 'app',
        alias: 'a',
        optionValue: {
          defaultValue: '1st app',
          dataType: MetaDataType.String
        },
        description: 'Specifies app name to use.'
      },
      {
        option: 'i18n-format',
        alias: 'f',
        optionValue: {
          possibleValues: ['xmb', 'xlf']
        },
        description: 'Output format for the generated file.'
      },
      {
        option: 'local',
        alias: 'l',
        description: 'Specifies the source language of the application.'
      },
      {
        option: 'out-file',
        alias: 'of',
        description: 'Name of the file to output.'
      },
      {
        option: 'output-path',
        alias: 'op',
        description: 'Path where output will be placed.'
      },
      {
        option: 'progress',
        optionValue: {
          defaultValue: 'true',
          dataType: MetaDataType.Boolean
        },
        description: 'Log progress to the console while building.',
        details: ['true inside TTY, false otherwise']
      },
      {
        option: 'verbose',
        description: 'Adds more details to output logging.'
      }
    ]
  }
] as AngularCliCommand[];
