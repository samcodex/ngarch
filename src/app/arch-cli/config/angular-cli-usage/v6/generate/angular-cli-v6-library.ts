import {
  AngularCliCommand,
  AngularCliCommandType,
  AngularCliOperandTemplate
} from '../../../../models/angular-cli';
import { MetaDataType } from '@config/meta-config';

export const AngularCli_V6_Library = [
  {
    command: AngularCliCommandType.Generate,
    template: AngularCliOperandTemplate.Library,
    description: 'Generate a library project for Angular',
    options: [
      {
        option: 'dry-run',
        alias: 'd',
        description: 'Run through without making any changes.',
        optionValue: {
          dataType: MetaDataType.Boolean,
          defaultValue: true
        }
      },
      {
        option: 'force',
        alias: 'f',
        description: 'Forces overwriting of files.',
        optionValue: {
          defaultValue: false,
          dataType: MetaDataType.Boolean,
        }
      },
      {
        option: 'entry-file',
        description: 'The path to create the library\'s public API file.',
        optionValue: {
          dataType: MetaDataType.String,
        }
      },
      {
        option: 'prefix',
        alias: 'p',
        description: 'The prefix to apply to generated selectors.',
        optionValue: {
          dataType: MetaDataType.String
        }
      },
      {
        option: 'skip-package-json',
        description: 'Do not add dependencies to package.json.',
        optionValue: {
          dataType: MetaDataType.Boolean,
          defaultValue: false
        }
      },
      {
        option: 'skip-ts-config',
        description: 'Do not update tsconfig.json for development experience.',
        optionValue: {
          dataType: MetaDataType.Boolean,
          defaultValue: false
        }
      }
    ]
  }
] as AngularCliCommand[];
