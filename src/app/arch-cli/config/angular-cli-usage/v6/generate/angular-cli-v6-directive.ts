import {
  AngularCliCommand,
  AngularCliCommandType,
  AngularCliOperandTemplate
} from '../../../../models/angular-cli';
import { MetaDataType } from '@config/meta-config';

export const AngularCli_V6_Directive = [
  {
    command: AngularCliCommandType.Generate,
    template: AngularCliOperandTemplate.Directive,
    description: 'Generates a directive',
    allowExecute: true,
    operand: {
      name: 'my-component',
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
        option: 'project',
        description: 'The name of the project.',
        optionValue: {
          dataType: MetaDataType.String
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
        description: 'The selector to use for the directive.',
        optionValue: {
          dataType: MetaDataType.String
        }
      },
      {
        option: 'module ',
        alias: 'm',
        description: 'Allows specification of the declaring module.',
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
