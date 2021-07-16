import {
  AngularCliCommand,
  AngularCliCommandType
} from '../../../../models/angular-cli';
import { MetaDataType, MetaInputType } from '@config/meta-config';

export const AngularCli_V1_Serve: AngularCliCommand[] = [
  {
    command: AngularCliCommandType.Serve,
    description: 'Builds the application and starts a web server.',
    details: ['When running ng serve, the compiled output is served from memory, not from disk.',
              'This means that the application being served is not located on disk in the dist folder.'],
    operand: {
      name: '[project]',
    },
    options: [
      {
        option: 'host',
        optionValue: {
          defaultValue: 'localhost',
          dataType: MetaDataType.String
        },
        description: 'Host to listen on.'
      },
      {
        option: 'hmr',
        optionValue: {
          defaultValue: 'false',
          dataType: MetaDataType.Boolean
        },
        description: 'Enable hot module replacement.'
      },
      {
        option: 'live-reload',
        optionValue: {
          defaultValue: 'true',
          dataType: MetaDataType.Boolean
        },
        description: 'Whether to reload the page on change, using live-reload.'
      },
      {
        option: 'public-host',
        alias: 'live-reload-client',
        description: 'Specify the URL that the browser client will use.'
      },
      {
        option: 'disable-host-check',
        optionValue: {
          defaultValue: 'false',
          dataType: MetaDataType.Boolean
        },
        description: 'Don\'t verify connected clients are part of allowed hosts.'
      },
      {
        option: 'open',
        optionValue: {
          defaultValue: 'false',
          dataType: MetaDataType.Boolean
        },
        description: 'Opens the url in default browser.'
      },
      {
        option: 'port',
        optionValue: {
          defaultValue: '4200',
          dataType: MetaDataType.Number
        },
        description: 'Port to listen to for serving. --port 0 will get a free port.'
      },
       {
        option: 'ssl',
        description: 'Serve using HTTPS.'
      },
      {
        option: 'ssl-cert',
        description: 'SSL certificate to use for serving HTTPS.'
      },
      {
        option: 'ssl-key',
        description: 'SSL key to use for serving HTTPS.'
      },
      {
        option: 'aot',
        optionValue: {
          inputType: MetaInputType.CheckBox
        },
        description: 'Build using Ahead of Time compilation.'
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
        option: 'proxy-config',
        alias: 'pc',
        description: 'Use a proxy configuration file to send some requests to a backend server rather than the webpack dev server.'
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
] as any;
