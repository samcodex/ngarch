import {
  AngularCliCommand,
  AngularCliCommandType
} from '../../../../models/angular-cli';
import { MetaDataType } from '@config/meta-config';

export const AngularCli_V1_E2e = [
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
        option: 'config',
        alias: 'c',
        description: 'Use a specific config file. Defaults to the protractor config file in .angular-cli.json.'
      },
      {
        option: 'element-explorer',
        alias: 'ee',
        optionValue: {
          defaultValue: 'false',
          dataType: MetaDataType.Boolean
        },
        description: 'Start Protractor\'s Element Explorer for debugging.'
      },
      {
        option: 'serve',
        alias: 's',
        optionValue: {
          defaultValue: 'true',
          dataType: MetaDataType.Boolean
        },
        description: 'Compile and Serve the app. All serve options are also available. The live-reload option defaults to false, and the default port will be random.',
        details: ['NOTE: Build failure will not launch the e2e task. You must first fix error(s) and run e2e again.']
      },
      {
        option: 'specs',
        alias: 'sp',
        description: 'Override specs in the protractor config. Can send in multiple specs by repeating flag.',
        details: ['ng e2e --specs=spec1.ts --specs=spec2.ts']
      },
      {
        option: 'suite',
        alias: 'su',
        description: 'Override suite in the protractor config. Can send in multiple suite by comma separated values (ng e2e --suite=suiteA,suiteB).'
      },
      {
        option: 'webdriver-update',
        alias: 'wu',
        optionValue: {
          defaultValue: 'true',
          dataType: MetaDataType.Boolean
        },
        description: 'Try to update webdriver.'
      }
    ]
  }
] as AngularCliCommand[];
