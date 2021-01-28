import {
  AngularCliCommand,
  AngularCliCommandType
} from '../../../../models/angular-cli';
import { MetaDataType, MetaInputType } from '@config/meta-config';

export const AngularCli_V1_Eject = [
  {
    command: AngularCliCommandType.Eject,
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
        option: 'aot',
        description: 'Build using Ahead of Time compilation.'
      },
      {
        option: 'app',
        alias: 'a',
        optionValue: {
          defaultValue: '1st app',
          dataType: MetaDataType.String
        },
        description: 'Specifies app name to use.'
      },
      {
        option: 'base-href',
        alias: 'bh',
        optionValue: {
          defaultValue: '',
          dataType: MetaDataType.String
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
        option: 'force',
        optionValue: {
          defaultValue: false,
          dataType: MetaDataType.Boolean
        },
        description: 'Overwrite any webpack.config.js and npm scripts already existing.'
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
      }
    ]
  }
] as AngularCliCommand[];
