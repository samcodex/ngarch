import {
  AngularCliCommand,
  AngularCliCommandType,
  AngularCliOperandTemplate
} from '../../../../models/angular-cli';
import { MetaDataType } from '@config/meta-config';

export const AngularCli_V1_Enum = [
  {
    command: AngularCliCommandType.Generate,
    template: AngularCliOperandTemplate.Enum,
    description: 'Generates an enumeration',
    operand: {
      name: 'my-new-enum',
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
          dataType: MetaDataType.String,
        },
        description: 'Specifies app name to use.'
      }
    ]
  }
] as AngularCliCommand[];
