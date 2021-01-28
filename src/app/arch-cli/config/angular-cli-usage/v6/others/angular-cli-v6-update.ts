import {
  AngularCliCommand,
  AngularCliCommandType
} from '../../../../models/angular-cli';
import { MetaDataType } from '@config/meta-config';

export const AngularCli_V6_Update = [
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
        description: 'Run through without making any changes.',
        optionValue: {
          dataType: MetaDataType.Boolean,
          defaultValue: true
        }
      },
      {
        option: 'force',
        description: 'If false, will error out if installed packages are incompatible with the update.',
        optionValue: {
          defaultValue: false,
          dataType: MetaDataType.Boolean,
        }
      },
      {
        option: 'all',
        description: 'Whether to update all packages in package.json.'
      },
      {
        option: 'next',
        description: 'Use the largest version, including beta and RCs.'
      },
      {
        option: 'migrate-ony',
        description: 'Only perform a migration, does not update the installed version.'
      },
      {
        option: 'from',
        description: 'Version from which to migrate from. Only available with a single package being updated, and only on migration only.'
      },
      {
        option: 'to',
        description: 'Version up to which to apply migrations. Only available with a single package being updated, and only on migrations only. Requires from to be specified. Default to the installed version detected.'
      },
      {
        option: 'registry',
        description: 'The NPM registry to use.'
      }
    ]
  }
] as AngularCliCommand[];
