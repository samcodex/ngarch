import {
  AngularCliCommand,
  AngularCliCommandType,
  AngularCliOperandTemplate
} from '../../../../models/angular-cli';
import { MetaDataType } from '@config/meta-config';

export const AngularCli_V6_Component = [
  {
    command: AngularCliCommandType.Generate,
    template: AngularCliOperandTemplate.Component,
    description: 'Generates a component',
    allowExecute: true,
    operand: {
      name: 'my-new-component',
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
          dataType: MetaDataType.Boolean,
          defaultValue: false
        }
      },
      {
        option: 'project',
        description: 'The name of the project.',
        disabled: false,
        optionValue: {
          dataType: MetaDataType.String
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
        alias: 'v',
        description: 'Specifies the view encapsulation strategy.',
        disabled: false,
        optionValue: {
          dataType: MetaDataType.String,
          possibleValues: ['Emulated', 'Native', 'None', 'ShadowDom' ],
          defaultValue: 'None'
        }
      },
      {
        option: 'change-detection',
        alias: 'c',
        description: 'Specifies the change detection strategy.',
        disabled: false,
        optionValue: {
          dataType: MetaDataType.String,
          possibleValues: ['Default', 'OnPush' ],
          defaultValue: 'Default'
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
        option: 'styleext',
        description: 'The file extension to be used for style files.',
        disabled: false,
        optionValue: {
          dataType: MetaDataType.String,
          possibleValues: ['css', 'scss', 'sass', 'less', 'styl' ],
          defaultValue: 'css'
        }
      },
      {
        option: 'spec',
        description: 'Specifies if a spec file is generated.',
        optionValue: {
          dataType: MetaDataType.Boolean,
          defaultValue: true
        }
      },
      {
        option: 'flat',
        description: 'Flag to indicate if a dir is created.',
        optionValue: {
          dataType: MetaDataType.Boolean,
          defaultValue: false
        }
      },
      {
        option: 'skip-import',
        description: 'Flag to skip the module import.',
        optionValue: {
          dataType: MetaDataType.Boolean,
          defaultValue: false
        }
      },
      {
        option: 'selector',
        description: 'The selector to use for the component.',
        disabled: false,
        optionValue: {
          dataType: MetaDataType.String
        }
      },
      {
        option: 'module ',
        alias: 'm',
        description: 'Allows specification of the declaring module.',
        disabled: false,
        optionValue: {
          dataType: MetaDataType.String
        }
      },
      {
        option: 'export',
        description: 'Specifies if declaring module exports the component.',
        optionValue: {
          dataType: MetaDataType.Boolean,
          defaultValue: false
        }
      }
    ]
  }
] as AngularCliCommand[];
