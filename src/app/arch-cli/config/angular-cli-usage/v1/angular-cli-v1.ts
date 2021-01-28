import { AngularCli } from '../../../models/angular-cli';
import {
  AngularCli_V1_Class,
  AngularCli_V1_Component,
  AngularCli_V1_Directive,
  AngularCli_V1_Enum,
  AngularCli_V1_Guard,
  AngularCli_V1_Interface,
  AngularCli_V1_Module,
  AngularCli_V1_Pipe,
  AngularCli_V1_Service
} from './generate';

import {
  AngularCli_V1_Build,
  AngularCli_V1_Config,
  AngularCli_V1_Doc,
  AngularCli_V1_E2e,
  AngularCli_V1_Lint,
  AngularCli_V1_Eject,
  AngularCli_V1_New,
  AngularCli_V1_Serve,
  AngularCli_V1_Test,
  AngularCli_V1_Update,
  AngularCli_V1_Xi18n,
  AngularCli_V1_Version
} from './others';

import { AngularCli_Command_Overviews } from './cli-v1-command-overviews';

export const AngularCli_V1: AngularCli = {
  name: '',
  description: 'for Angular 2',
  version: '1.x',
  workFor: ['1', '2'],
  leading: '?',
  commands: [
    ...AngularCli_V1_Version,
    ...AngularCli_V1_Component,
    ...AngularCli_V1_Directive,
    ...AngularCli_V1_Pipe,
    ...AngularCli_V1_Service,
    ...AngularCli_V1_Class,
    ...AngularCli_V1_Guard,
    ...AngularCli_V1_Interface,
    ...AngularCli_V1_Enum,
    ...AngularCli_V1_Module,

    ...AngularCli_V1_Build,
    ...AngularCli_V1_Config,
    ...AngularCli_V1_Doc,
    ...AngularCli_V1_E2e,
    ...AngularCli_V1_Eject,
    ...AngularCli_V1_Lint,
    ...AngularCli_V1_New,
    ...AngularCli_V1_Serve,
    ...AngularCli_V1_Test,
    ...AngularCli_V1_Update,
    ...AngularCli_V1_Xi18n
  ],
  overviews: [
    ...AngularCli_Command_Overviews
  ]
};
