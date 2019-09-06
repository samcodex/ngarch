import {
  AngularCliCommand,
  AngularCliCommandType,
  AngularCliOperandTemplate
} from '../../../../models/angular-cli';
import { MetaDataType } from '@config/meta-config';

export const AngularCli_V6_Interface: AngularCliCommand[] = [
  {
    command: AngularCliCommandType.Generate,
    template: AngularCliOperandTemplate.Interface,
    description: 'Generates an interface',
    allowExecute: true,
    operand: {
      name: 'my-new-interface',
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
        description: 'Specifies the prefix to use.',
        optionValue: {
          dataType: MetaDataType.String
        }
      }
    ]
  }
];
