import {
  AngularCliCommand,
  AngularCliCommandType,
  AngularCliOperandTemplate
} from '../../../../models/angular-cli';
import { MetaDataType } from '@config/meta-config';

export const AngularCli_V6_Application = [
  {
    command: AngularCliCommandType.Generate,
    template: AngularCliOperandTemplate.Application,
    description: 'Creates an angular application.',
    allowExecute: false,
    operand: {
      name: 'my-new-application',
    },
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
        option: 'inline-style',
        alias: 's',
        description: 'Specifies if the style will be in the ts file.',
        optionValue: {
          dataType: MetaDataType.Boolean,
          defaultValue: false
        }
      },
      {
        option: 'inline-template',
        alias: 't',
        description: 'Specifies if the template will be in the ts file.',
        optionValue: {
          dataType: MetaDataType.Boolean,
          defaultValue: false
        }
      },
      {
        option: 'view-encapsulation',
        description: 'Specifies the view encapsulation strategy.',
        disabled: false,
        optionValue: {
          dataType: MetaDataType.String,
          possibleValues: ['Emulated', 'Native', 'None', 'ShadowDom' ],
          defaultValue: 'None'
        }
      },
      {
        option: 'routing',
        description: 'Generates a routing module.',
        optionValue: {
          dataType: MetaDataType.Boolean,
          defaultValue: false
        }
      },
      {
        option: 'prefix',
        alias: 'p',
        description: 'The prefix to apply to generated selectors.',
        disabled: false,
        optionValue: {
          dataType: MetaDataType.String
        }
      },
      {
        option: 'style',
        description: 'The file extension to be used for style files.',
        disabled: false,
        optionValue: {
          dataType: MetaDataType.String,
          possibleValues: ['css', 'scss', 'sass', 'less', 'styl' ],
          defaultValue: 'css'
        }
      },
      {
        option: 'skip-tests',
        alias: 'S',
        description: 'Skip creating spec files.',
        optionValue: {
          dataType: MetaDataType.Boolean,
          defaultValue: false
        }
      },
      {
        option: 'skip-package-json',
        description: 'Do not add dependencies to package.json.',
        optionValue: {
          dataType: MetaDataType.Boolean,
          defaultValue: false
        }
      }
    ]
  }
] as AngularCliCommand[];
