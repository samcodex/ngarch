import {
  AngularCliCommand,
  AngularCliCommandType
} from '../../../../models/angular-cli';

export const AngularCli_V6_Test = [
  {
    command: AngularCliCommandType.Test,
    description: 'Compiles the application into an output directory',
    details: [
      'Tests will execute after a build is executed via Karma, and it will automatically watch your files for changes. You can run tests a single time via --watch=false.',
      'You can run tests with coverage via --code-coverage. The coverage report will be in the coverage/ directory.'
    ],
    options: [
      {
        option: 'prod',
        description: 'Flag to set configuration to "prod".'
      },
      {
        option: 'configuration',
        alias: 'c',
        description: 'Specify the configuration to use.'
      },
      {
        option: 'main',
        description: 'The name of the main entry-point file.'
      },
      {
        option: 'ts-config',
        description: 'The name of the TypeScript configuration file.'
      },
      {
        option: 'karma-config',
        description: 'The name of the Karma configuration file.'
      },
      {
        option: 'polyfills',
        description: 'The name of the polyfills file.'
      },
      {
        option: 'environment',
        description: 'Defines the build environment.'
      },
      {
        option: 'source-map',
        description: 'Output sourcemaps.'
      },
      {
        option: 'progress',
        description: 'Log progress to the console while building.'
      },
      {
        option: 'watch',
        description: 'Run build when files change.'
      },
      {
        option: 'poll',
        description: 'Enable and define the file watching poll time period in milliseconds.'
      },
      {
        option: 'preserve-symlinks',
        description: 'Do not use the real path when resolving modules.'
      },
      {
        option: 'browsers',
        description: 'Override which browsers tests are run against.'
      },
      {
        option: 'code-covergage',
        description: 'Output a code coverage report.'
      }
    ]
  }
] as AngularCliCommand[];
