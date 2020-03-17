import {
  AngularCliCommand,
  AngularCliCommandType
} from '../../../../models/angular-cli';
import { MetaDataType } from '@config/meta-config';

export const AngularCli_V6_Lint = [
  {
    command: AngularCliCommandType.Lint,
    description: 'Lint you app code using tslint.',
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
        option: 'tslint-config',
        description: 'The name of the TSLint configuration file.'
      },
      {
        option: 'fix',
        description: 'Fixes linting errors (may overwrite linted files).'
      },
      {
        option: 'type-check',
        description: 'Controls the type check for linting.'
      },
      {
        option: 'force',
        description: 'Succeeds even if there was linting errors.',
        optionValue: {
          defaultValue: false,
          dataType: MetaDataType.Boolean,
        }
      },
      {
        option: 'silent',
        description: 'Show output text.'
      },
      {
        option: 'format',
        description: 'Output format (prose, json, stylish, verbose, pmd, msbuild, checkstyle, vso, fileslist).'
      }
    ]
  }
] as AngularCliCommand[];
