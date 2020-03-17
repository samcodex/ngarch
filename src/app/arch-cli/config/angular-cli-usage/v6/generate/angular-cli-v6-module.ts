import {
  AngularCliCommand,
  AngularCliCommandType,
  AngularCliOperandTemplate
} from '../../../../models/angular-cli';
import { MetaDataType } from '@config/meta-config';

export const AngularCli_V6_Module = [
  {
    command: AngularCliCommandType.Generate,
    template: AngularCliOperandTemplate.Module,
    description: 'Generates an NgModule',
    allowExecute: true,
    operand: {
      name: 'my-module',
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
        option: 'routing',
        description: 'Generates a routing module.',
        optionValue: {
          dataType: MetaDataType.Boolean,
          defaultValue: false
        }
      },
      {
        option: 'routing-scope',
        description: 'The scope for the generated routing.',
        optionValue: {
          dataType: MetaDataType.Boolean,
          possibleValues: [ 'Child', 'Root' ],
          defaultValue: 'Child'
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
        option: 'module ',
        alias: 'm',
        description: 'Allows specification of the declaring module.',
        optionValue: {
          dataType: MetaDataType.String
        }
      }
    ]
  }
] as AngularCliCommand[];
