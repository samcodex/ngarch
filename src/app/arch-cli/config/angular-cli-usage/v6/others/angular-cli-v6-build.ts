import {
  AngularCliCommand,
  AngularCliCommandType
} from '../../../../models/angular-cli';

export const AngularCli_V6_Build = [
  {
    command: AngularCliCommandType.Build,
    description: 'Compiles the application into an output directory.',
    details: [
      'The build artifacts will be stored in the dist/ directory.',
      'All commands that build or serve your project, ng build/serve/e2e, will delete the output directory (dist/ by default). This can be disabled via the --delete-output-path=false option.'
    ],
    operand: {
      name: '[project]',
    },
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
        option: 'polyfills',
        description: 'The name of the polyfills file.'
      },
      {
        option: 'ts-config',
        description: 'The name of the TypeScript configuration file.'
      },
      {
        option: 'optimization',
        description: 'Defines the optimization level of the build.'
      },
      {
        option: 'output-path',
        description: 'Path where output will be placed.'
      },
      {
        option: 'aot',
        description: 'Build using Ahead of Time compilation.'
      },
      {
        option: 'source-map',
        description: 'Output sourcemaps.'
      },
      {
        option: 'eval-source-map',
        description: 'Output in-file eval sourcemaps.'
      },
      {
        option: 'vendor-chunk',
        description: 'Use a separate bundle containing only vendor libraries.'
      },
      {
        option: 'common-chunk',
        description: 'Use a separate bundle containing code used across multiple bundles.'
      },
      {
        option: 'base-href',
        description: 'Base url for the application being built.'
      },
      {
        option: 'deploy-url',
        description: 'URL where files will be deployed.'
      },
      {
        option: 'verbose',
        description: 'Adds more details to output logging.'
      },
      {
        option: 'progress',
        description: 'Log progress to the console while building.'
      },
      {
        option: 'i18n-file',
        description: 'Localization file to use for i18n.'
      },
      {
        option: 'i18n-format',
        description: 'Format of the localization file specified with --i18n-file.'
      },
      {
        option: 'i18n-locale',
        description: 'Locale to use for i18n.'
      },
      {
        option: 'i18n-missing-translation',
        description: 'How to handle missing translations for i18n.'
      },
      {
        option: 'extract-css',
        description: 'Extract css from global styles onto css files instead of js ones.'
      },
      {
        option: 'watch',
        description: 'Run build when files change.'
      },
      {
        option: 'output-hashing',
        description: 'Define the output filename cache-busting hashing mode.'
      },
      {
        option: 'poll',
        description: 'Enable and define the file watching poll time period in milliseconds.'
      },
      {
        option: 'delete-output-path',
        description: 'Delete the output path before building.'
      },
      {
        option: 'preserve-symlinks',
        description: 'Do not use the real path when resolving modules.'
      },
      {
        option: 'extract-licenses',
        description: 'Extract all licenses in a separate file, in the case of production builds only.'
      },
      {
        option: 'show-circular-dependencies',
        description: 'Show circular dependency warnings on builds.'
      },
      {
        option: 'build-optimizer',
        description: 'Enables @angular-devkit/build-optimizer optimizations when using the \'aot\' option.'
      },
      {
        option: 'named-chunks',
        description: 'Use file name for lazy loaded chunks.'
      },
      {
        option: 'subresource-integrity',
        description: 'Enables the use of subresource integrity validation.'
      },
      {
        option: 'service-worker',
        description: 'Generates a service worker config for production builds.'
      },
      {
        option: 'ngsw-config-path',
        description: 'Path to ngsw-config.json.'
      },
      {
        option: 'skip-app-shell',
        description: 'Flag to prevent building an app shell.'
      },
      {
        option: 'index',
        description: 'The name of the index HTML file.'
      },
      {
        option: 'stats-json',
        description: 'Generates a \'stats.json\' file which can be analyzed using tools such as: #webpack-bundle-analyzer or https: //webpack.github.io/analyse.'
      },
      {
        option: 'fork-type-checker',
        description: 'Run the TypeScript type checker in a forked process.'
      }
    ]
  }
] as AngularCliCommand[];
