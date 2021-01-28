import {
  AngularCliCommand,
  AngularCliCommandType,
  AngularCliOperandTemplate
} from '../../../../models/angular-cli';
import { MetaDataType } from '@config/meta-config';

export const AngularCli_V6_Class = [
  {
    command: AngularCliCommandType.Generate,
    template: AngularCliOperandTemplate.Class,
    description: 'Generates a class',
    allowExecute: true,
    operand: {
      name: 'my-new-class',
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
        disabled: false,
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
        option: 'type',
        description: 'Specifies the type of class.',
        optionValue: {
          dataType: MetaDataType.String
        }
      }
    ]
  }
] as AngularCliCommand[];
