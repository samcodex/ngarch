import {
  AngularCliCommand,
  AngularCliCommandType
} from '../../../../models/angular-cli';

export const AngularCli_V6_Doc: AngularCliCommand[] = [
  {
    command: AngularCliCommandType.Doc,
    description: 'Opens the official Angular API documentation for a given keyword on angular.io.',
    operand: {
      name: '[search] [term]',
    },
    options: [
      {
        option: 'search',
        alias: 's',
        description: 'Search whole angular.io instead of just api.'
      }
    ]
  }
];
