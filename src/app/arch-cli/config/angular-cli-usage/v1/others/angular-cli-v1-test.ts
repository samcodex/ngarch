import {
  AngularCliCommand,
  AngularCliCommandType
} from '../../../../models/angular-cli';
import { MetaDataType } from '@config/meta-config';

export const AngularCli_V1_Test = [
  {
    command: AngularCliCommandType.Test,
    description: 'Compiles the application into an output directory',
    details: [
      'Tests will execute after a build is executed via Karma, and it will automatically watch your files for changes.',
      'You can run tests a single time via --watch=false or --single-run.',
      'You can run tests with coverage via --code-coverage. The coverage report will be in the coverage/ directory.'
    ],
    options: [
      {
        option: 'app',
        alias: 'a',
        optionValue: {
          defaultValue: '1st app',
          dataType: MetaDataType.String
        },
        description: 'Specifies app name or index to use.'
      },
      {
        option: 'browsers',
        description: 'Override which browsers tests are run against.'
      },
      {
        option: 'code-covergage',
        alias: 'cc',
        optionValue: {
          defaultValue: 'false',
          dataType: MetaDataType.Boolean
        },
        description: 'Coverage report will be in the coverage/ directory.'
      },
      {
        option: 'colors',
        description: 'Enable or disable colors in the output (reporters and logs).'
      },
      {
        option: 'config',
        alias: 'c',
        description: 'Use a specific config file. Defaults to the karma config file in `.angular-cli.json`.'
      },
      {
        option: 'environment',
        alias: 'e',
        description: 'Defines the build environment.'
      },

      {
        option: 'log-level',
        description: 'Level of logging.'
      },
      {
        option: 'poll',
        description: 'Enable and define the file watching poll time period in milliseconds.'
      },
      {
        option: 'port',
        description: 'Port where the web server will be listening.'
      },
      {
        option: 'progress',
        optionValue: {
          defaultValue: 'true',
          dataType: MetaDataType.Boolean
        },
        description: 'Log progress to the console while building.',
        details: ['true inside TTY, false otherwise']
      },

      {
        option: 'reporters',
        description: 'List of reporters to use.'
      },
      {
        option: 'single-run',
        alias: 'sr',
        description: 'Run tests a single time.'
      },
      {
        option: 'source-map',
        alias: 'sm',
        description: 'Output sourcemaps.'
      },
      {
        option: 'watch',
        alias: 'w',
        description: 'Run build when files change.'
      }
    ]
  }
] as AngularCliCommand[];
