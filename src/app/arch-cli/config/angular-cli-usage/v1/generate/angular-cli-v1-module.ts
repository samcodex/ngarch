import {
  AngularCliCommand,
  AngularCliCommandType,
  AngularCliOperandTemplate
} from '../../../../models/angular-cli';
import { MetaDataType } from '../../../../../config';

export const AngularCli_V1_Module: AngularCliCommand[] = [
  {
    command: AngularCliCommandType.Generate,
    template: AngularCliOperandTemplate.Module,
    description: 'Generates an NgModule',
    operand: {
      name: 'my-module',
    },
    options: [
      {
        option: 'dry-run',
        alias: 'd',
        optionValue: {
          defaultValue: true,
          dataType: MetaDataType.Boolean,
        },
        description: 'Run through without making any changes.'
      },
      {
        option: 'force',
        alias: 'f',
        optionValue: {
          defaultValue: false,
          dataType: MetaDataType.Boolean,
        },
        description: 'Forces overwriting of files.'
      },
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
        option: 'flat',
        optionValue: {
          defaultValue: false,
          dataType: MetaDataType.Boolean,
        },
        description: 'Flag to indicate if a dir is created.'
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
        option: 'spec',
        description: 'Specifies if a spec file is generated.',
        optionValue: {
          dataType: MetaDataType.Boolean,
          defaultValue: true
        }
      },
      {
        option: 'routing',
        description: 'Specifies if a routing module file should be generated.',
        optionValue: {
          dataType: MetaDataType.Boolean,
          defaultValue: false
        }
      }
    ]
  }
];
