import {
  AngularCliCommand,
  AngularCliCommandType
} from '../../../../models/angular-cli';
import { MetaDataType } from '../../../../../config';

export const AngularCli_V1_Config: AngularCliCommand[] = [
  {
    command: AngularCliCommandType.Config,
    operand: {
      name: '[key] [value]',
      description: 'Get/set configuration values. [key] should be in JSON path format. Example: a[3].foo.bar[2]. If only the [key] is provided it will get the value. If both the [key] and [value] are provided it will set the value.'
    },
    options: [
      {
        option: 'global',
        optionValue: {
          defaultValue: 'false',
          dataType: MetaDataType.Boolean
        },
        description: 'Get/set the value in the global configuration (in your home directory).'
      }
    ]
  }
];
