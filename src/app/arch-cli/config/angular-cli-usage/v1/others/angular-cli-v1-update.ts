import {
  AngularCliCommand,
  AngularCliCommandType
} from '../../../../models/angular-cli';
import { MetaDataType } from '../../../../../config';

export const AngularCli_V1_Update: AngularCliCommand[] = [
  {
    command: AngularCliCommandType.Update,
    description: 'Updates the current application to latest versions.',
    operand: {
      name: '[package]',
    },
    options: [
      {
        option: 'dry-run',
        alias: 'd',
        optionValue: {
          defaultValue: true,
          dataType: MetaDataType.Boolean
        },
        description: 'Run through without making any changes. Will list all files that would have been created when running ng update.'
      },
      {
        option: 'next',
        optionValue: {
          defaultValue: 'false',
          dataType: MetaDataType.Boolean
        },
        description: 'Install the next version published as `@next` on npm, instead of the latest.'
      }
    ]
  }
];
