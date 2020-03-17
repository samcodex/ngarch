import {
  AngularCliCommand,
  AngularCliCommandType
} from '../../../../models/angular-cli';
import { MetaDataType, MetaInputType } from '@config/meta-config';

export const AngularCli_V1_Lint = [
  {
    command: AngularCliCommandType.Lint,
    description: 'Lint you app code using tslint.',
    operand: {
      name: '[project]',
    },
    options: [
      {
        option: 'fix',
        optionValue: {
          defaultValue: 'false',
          dataType: MetaDataType.Boolean
        },
        description: 'Fixes linting errors (may overwrite linted files).'
      },
      {
        option: 'force',
        optionValue: {
          defaultValue: false,
          dataType: MetaDataType.Boolean
        },
        description: 'Succeeds even if there was linting errors.'
      },
      {
        option: 'type-check',
        optionValue: {
          defaultValue: 'false',
          dataType: MetaDataType.Boolean
        },
        description: 'Controls the type check for linting.'
      },
      {
        option: 'format',
        alias: 't',
        optionValue: {
          defaultValue: 'prose',
          dataType: MetaDataType.String,
          inputType: MetaInputType.Selection,
          possibleValues: ['prose', 'json', 'stylish', 'verbose', 'pmd', 'msbuild', 'checkstyle', 'vso', 'fileslist', 'codeFrame']
        },
        description: 'Output format.'
      }
    ]
  }
] as AngularCliCommand[];
