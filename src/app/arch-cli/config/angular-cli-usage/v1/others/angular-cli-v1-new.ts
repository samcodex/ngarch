import {
  AngularCliCommand,
  AngularCliCommandType
} from '../../../../models/angular-cli';
import { MetaDataType } from '@config/meta-config';

export const AngularCli_V1_New = [
  {
    command: AngularCliCommandType.New,
    description: 'Creates a new angular application.',
    operand: {
      name: '[name]',
    },
    options: [
      {
        option: 'directory',
        alias: 'd',
        optionValue: {
          defaultValue: 'dir',
          dataType: MetaDataType.String
        },
        description: 'The directory name to create the app in.'
      },
      {
        option: 'dry-run',
        alias: 'd',
        optionValue: {
          defaultValue: true,
          dataType: MetaDataType.Boolean
        },
        description: 'Run through without making any changes. Will list all files that would have been created when running ng new.'
      },
      {
        option: 'inline-style',
        alias: 's',
        optionValue: {
          defaultValue: false,
          dataType: MetaDataType.Boolean
        },
        description: 'Should have an inline style.'
      },
      {
        option: 'inline-template',
        alias: 't',
        optionValue: {
          defaultValue: false,
          dataType: MetaDataType.Boolean
        },
        description: 'Should have an inline template.'
      },
      {
        option: 'minimal',
        optionValue: {
          defaultValue: false,
          dataType: MetaDataType.Boolean
        },
        description: 'Should create a minimal app.'
      },
      {
        option: 'prefix',
        alias: 'p',
        optionValue: {
          defaultValue: 'app',
          dataType: MetaDataType.String
        },
        description: 'The prefix to use for all component selectors. You can later change the value in .angular-cli.json.'
      },
      {
        option: 'routing',
        optionValue: {
          defaultValue: false,
          dataType: MetaDataType.Boolean
        },
        description: 'Generates a routing module.'
      },
      {
        option: 'skip-commit',
        alias: 'sc',
        optionValue: {
          defaultValue: false,
          dataType: MetaDataType.Boolean
        },
        description: 'Skip committing the first commit to git.'
      },
      {
        option: 'skip-git',
        alias: 'g',
        optionValue: {
          defaultValue: false,
          dataType: MetaDataType.Boolean
        },
        description: 'Skip initializing a git repository.'
      },
      {
        option: 'skip-install',
        alias: 'si',
        optionValue: {
          defaultValue: false,
          dataType: MetaDataType.Boolean
        },
        description: 'Skip installing packages.'
      },
      {
        option: 'skip-tests',
        alias: 'S',
        optionValue: {
          defaultValue: false,
          dataType: MetaDataType.Boolean
        },
        description: 'Skip creating spec files. Skip including e2e functionality.'
      },
      {
        option: 'source-dir',
        alias: 'D',
        optionValue: {
          defaultValue: 'src',
          dataType: MetaDataType.String
        },
        description: 'The name of the source directory. You can later change the value in .angular-cli.json.'
      },
      {
        option: 'style',
        optionValue: {
          dataType: MetaDataType.String,
          possibleValues: ['css', 'scss', 'sass', 'less', 'styl' ],
          defaultValue: 'css'
        },
        description: 'The style file default extension. Possible values:css, scss, less, sass, styl(stylus). You can later change the value in .angular-cli.json.'
      },
      {
        option: 'verbose',
        alias: 'v',
        optionValue: {
          defaultValue: false,
          dataType: MetaDataType.Boolean
        },
        description: 'Adds more details to output logging.'
      }
    ]
  }
] as AngularCliCommand[];
