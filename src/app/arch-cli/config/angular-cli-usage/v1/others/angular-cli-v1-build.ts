import {
  AngularCliCommand,
  AngularCliCommandType
} from '../../../../models/angular-cli';
import { MetaDataType, MetaInputType } from '@config/meta-config';

export const AngularCli_V1_Build = [
  {
    command: AngularCliCommandType.Build,
    description: 'Compiles the application into an output directory.',
    details: [
      'The build artifacts will be stored in the dist/ directory.',
      'All commands that build or serve your project, ng build/serve/e2e, will delete the output directory (dist/ by default). This can be disabled via the --no-delete-output-path (or --delete-output-path=false) flag.'
    ],
    operand: {
      name: '[project]',
    },
    options: [
      {
        option: 'aot',
        optionValue: {
          defaultValue: 'false',
          inputType: MetaInputType.CheckBox,
        },
        description: 'Build using Ahead of Time compilation.'
      },
      {
        option: 'app',
        alias: 'a',
        description: 'Specifies app name or index to use.',
        optionValue: {
          defaultValue: '',
          dataType: MetaDataType.String,
        },
      },
      {
        option: 'base-href',
        alias: 'bh',
        optionValue: {
          defaultValue: '',
          dataType: MetaDataType.String,
        },
        description: 'Base url for the application being built.'
      },
      {
        option: 'deploy-url',
        alias: 'd',
        optionValue: {
          dataType: MetaDataType.String
        },
        description: 'URL where files will be deployed.'
      },
      {
        option: 'environment',
        alias: 'e',
        description: 'Defines the build environment.'
      },
      {
        option: 'extract-css',
        alias: 'ec',
        description: 'Extract css from global styles onto css files instead of js ones..'
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
        option: 'local',
        description: 'Locale to use for i18n.'
      },
      {
        option: 'missing-translation',
        optionValue: {
          inputType: MetaInputType.Selection,
          possibleValues: ['error', 'warning', 'ignore']
        },
        description: 'How to handle missing translations for i18n.'
      },
      {
        option: 'output-hashing',
        alias: 'oh',
        optionValue: {
          inputType: MetaInputType.Selection,
          possibleValues: ['none', 'all', 'media', 'bundles']
        },
        description: 'Define the output filename cache-busting hashing mode.'
      },
      {
        option: 'output-path',
        alias: 'op',
        description: 'Path where output will be placed.'
      },
      {
        option: 'delete-output-path',
        alias: 'dop',
        optionValue: {
          defaultValue: 'true',
          dataType: MetaDataType.Boolean
        },
        description: 'Delete the output-path directory.'
      },
      {
        option: 'poll',
        description: 'Enable and define the file watching poll time period (milliseconds).'
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
        option: 'source-map',
        alias: 'sm',
        description: 'Output sourcemaps.'
      },
      {
        option: 'stats-json',
        description: 'Generates a \'stats.json\' file which can be analyzed using tools such as: #webpack-bundle-analyzer or https: //webpack.github.io/analyse.'
      },
      {
        option: 'target',
        alias: 't, -dev, -prod',
        description: 'Defines the build target.'
      },
      {
        option: 'vendor-chunk',
        alias: 'vc',
        optionValue: {
          defaultValue: 'true',
          dataType: MetaDataType.Boolean
        },
        description: 'Use a separate bundle containing only vendor libraries.'
      },
      {
        option: 'common-chunk',
        alias: 'cc',
        optionValue: {
          defaultValue: 'true',
          dataType: MetaDataType.Boolean
        },
        description: 'Use a separate bundle containing code used across multiple bundles.'
      },
      {
        option: 'verbose',
        alias: 'v',
        optionValue: {
          defaultValue: 'false',
          dataType: MetaDataType.Boolean
        },
        description: 'Adds more details to output logging.'
      },
      {
        option: 'watch',
        alias: 'w',
        description: 'Run build when files change.'
      },
      {
        option: 'show-circular-dependencies',
        alias: 'scd',
        description: 'Show circular dependency warnings on builds.'
      },
      {
        option: 'build-optimizer',
        description: 'Enables @angular-devkit/build-optimizer optimizations when using the \'aot\' option.'
      },
      {
        option: 'named-chunks',
        alias: 'nc',
        description: 'Use file name for lazy loaded chunks.'
      },
      {
        option: 'bundle-dependencies',
        description: 'In a server build, state whether `all` or `none` dependencies should be bundles in the output.'
      },
      {
        option: 'extract-licenses',
        optionValue: {
          defaultValue: 'false',
          dataType: MetaDataType.Boolean
        },
        description: 'Extract all licenses in a separate file, in the case of production builds only.'
      }
    ]
  }
] as AngularCliCommand[];
