import {
  AngularCliCommand,
  AngularCliCommandType
} from '../../../models/angular-cli';

export const AngularCli_Command_Overviews = [
  {
    command: AngularCliCommandType.Generate,
    description: 'Generates the specified schematic',
    operand: {
      name: '[name]',
    }
  },
  {
    command: AngularCliCommandType.Build,
    description: 'Compiles the application into an output directory.',
    details: [
      'The build artifacts will be stored in the dist/ directory.',
      'All commands that build or serve your project, ng build/serve/e2e, will delete the output directory (dist/ by default). This can be disabled via the --delete-output-path=false option.'
    ],
    operand: {
      name: '[project]',
    }
  },
  {
    command: AngularCliCommandType.Config,
    description: 'Get/set configuration values. [key] should be in JSON path format. Example: a[3].foo.bar[2]. If only the [key] is provided it will get the value. If both the [key] and [value] are provided it will set the value.',
    operand: {
      name: '[key] [value]',
    }
  },
  {
    command: AngularCliCommandType.Doc,
    description: 'Opens the official Angular API documentation for a given keyword on angular.io.',
    operand: {
      name: '[search] [term]',
    }
  },
  {
    command: AngularCliCommandType.E2e,
    description: 'Serves the application and runs end-to-end tests.',
    details: [
      'End-to-end tests are run via Protractor.'
    ],
    operand: {
      name: '[project]',
    }
  },
  {
    command: AngularCliCommandType.Lint,
    description: 'Lint you app code using tslint.',
    operand: {
      name: '[project]',
    }
  },
  {
    command: AngularCliCommandType.New,
    description: 'Creates a new angular application. Default applications are created in a directory of the same name, with an initialized Angular application.',
    operand: {
      name: '[name]',
    }
  },
  {
    command: AngularCliCommandType.Serve,
    description: 'Builds the application and starts a web server.',
    operand: {
      name: '[project]',
    }
  },
  {
    command: AngularCliCommandType.Test,
    description: 'Compiles the application into an output directory',
    details: [
      'Tests will execute after a build is executed via Karma, and it will automatically watch your files for changes. You can run tests a single time via --watch=false.',
      'You can run tests with coverage via --code-coverage. The coverage report will be in the coverage/ directory.'
    ]
  },
  {
    command: AngularCliCommandType.Update,
    description: 'Updates the current application to latest versions.',
    operand: {
      name: '[package]',
    }
  },
  {
    command: AngularCliCommandType.Xi18n,
    description: 'Extracts i18n messages from the templates.',
    operand: {
      name: '[project]',
    }
  },
  {
    command: AngularCliCommandType.Eject,
    description: 'Ejects your app and output the proper webpack configuration and scripts.',
    operand: {
      name: '[project]',
    }
  }
] as AngularCliCommand[];
