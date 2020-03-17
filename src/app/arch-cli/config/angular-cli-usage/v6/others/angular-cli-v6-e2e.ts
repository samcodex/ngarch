import {
  AngularCliCommand,
  AngularCliCommandType
} from '../../../../models/angular-cli';

export const AngularCli_V6_E2e = [
  {
    command: AngularCliCommandType.E2e,
    description: 'Serves the application and runs end-to-end tests.',
    details: [
      'End-to-end tests are run via Protractor.'
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
        option: 'protractor-config',
        description: 'The name of the Protractor configuration file.'
      },
      {
        option: 'dev-server-target',
        description: 'Dev server target to run tests against.'
      },
      {
        option: 'suite',
        description: 'Override suite in the protractor config.'
      },
      {
        option: 'element-explorer',
        description: 'Start Protractor\'s Element Explorer for debugging.'
      },
      {
        option: 'webdriver-update',
        description: 'Try to update webdriver.'
      },
      {
        option: 'serve',
        description: 'Compile and Serve the app.'
      },
      {
        option: 'port',
        description: 'The port to use to serve the application.'
      },
      {
        option: 'host',
        description: 'Host to listen on.'
      },
      {
        option: 'base-url',
        description: 'Base URL for protractor to connect to.'
      }
    ]
  }
] as AngularCliCommand[];
