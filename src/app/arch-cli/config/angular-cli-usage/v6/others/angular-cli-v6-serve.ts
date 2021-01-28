import {
  AngularCliCommand,
  AngularCliCommandType
} from '../../../../models/angular-cli';

export const AngularCli_V6_Serve = [
  {
    command: AngularCliCommandType.Serve,
    description: 'Builds the application and starts a web server.',
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
        option: 'browser-target',
        description: 'Target to serve.'
      },
      {
        option: 'port',
        description: 'Port to listen on.'
      },
      {
        option: 'host',
        description: 'Host to listen on.'
      },
      {
        option: 'proxy-config',
        description: 'Proxy configuration file.'
      },
      {
        option: 'ssl',
        description: 'Serve using HTTPS.'
      },
      {
        option: 'ssl-key',
        description: 'SSL key to use for serving HTTPS.'
      },
      {
        option: 'ssl-cert',
        alias: 'd',
        description: 'SSL certificate to use for serving HTTPS.'
      },
      {
        option: 'open',
        description: 'Opens the url in default browser.'
      },
      {
        option: 'live-reload',
        description: 'Whether to reload the page on change, using live-reload.'
      },
      {
        option: 'public-host',
        description: 'Specify the URL that the browser client will use.'
      },
      {
        option: 'serve-path',
        description: 'The pathname where the app will be served.'
      },
      {
        option: 'disable-host-check',
        description: 'Don\'t verify connected clients are part of allowed hosts.'
      },
      {
        option: 'hmr',
        description: 'Enable hot module replacement.'
      },
      {
        option: 'watch',
        description: 'Rebuild on change.'
      },
      {
        option: 'hmr-warning',
        alias: 'd',
        description: 'Show a warning when the --hmr option is enabled.'
      },
      {
        option: 'serve-path-default-warning',
        description: 'Show a warning when deploy-url/base-href use unsupported serve path values.'
      },
      {
        option: 'optimization',
        description: 'Defines the optimization level of the build.'
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
      }
    ]
  }
] as AngularCliCommand[];
