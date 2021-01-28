import {
  AngularCliCommand,
  AngularCliCommandType
} from '../../../../models/angular-cli';
import { MetaDataType } from '@config/meta-config';

export const AngularCli_V1_Doc = [
  {
    command: AngularCliCommandType.Doc,
    description: 'Opens the official Angular API documentation for a given keyword on angular.io.',
    operand: {
      name: '[search] [term]',
    },
    options: [
      {
        option: 'search',
        alias: 's',
        optionValue: {
          defaultValue: 'false',
          dataType: MetaDataType.Boolean
        },
        description: 'Search for the keyword in the whole [angular.io](https://angular.io) documentation instead of just the API.'
      }
    ]
  }
] as AngularCliCommand[];
