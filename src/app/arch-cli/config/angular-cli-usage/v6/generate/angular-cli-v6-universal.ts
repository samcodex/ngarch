import {
  AngularCliCommand,
  AngularCliCommandType,
  AngularCliOperandTemplate
} from '../../../../models/angular-cli';
import { MetaDataType } from '@config/meta-config';

export const AngularCli_V6_Universal = [
  {
    command: AngularCliCommandType.Generate,
    template: AngularCliOperandTemplate.Universal,
    description: 'Creates an angular universal app.',
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
        option: 'client-project',
        description: 'Name of related client app.'
      },
      {
        option: 'app-id',
        description: 'The appId to use withServerTransition.'
      },
      {
        option: 'main',
        description: 'The name of the main entry-point file.'
      },
      {
        option: 'test',
        description: 'The name of the test entry-point file.'
      },
      {
        option: 'tsconfig-file-name',
        description: 'The name of the TypeScript configuration file.'
      },
      {
        option: 'test-tsconfig-file-name',
        description: 'The name of the TypeScript configuration file for tests.'
      },
      {
        option: 'app-dir',
        description: 'The name of the application directory.'
      },
      {
        option: 'root-module-file-name',
        description: 'The name of the root module file'
      },
      {
        option: 'root-module-class-name',
        description: 'The name of the root module class.'
      },
      {
        option: 'skip-install',
        description: 'Skip installing dependency packages.'
      }
    ]
  }
] as AngularCliCommand[];
