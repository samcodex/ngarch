import { AngularCli } from '../../../models/angular-cli';
import {
  AngularCli_V6_Class,
  AngularCli_V6_Component,
  AngularCli_V6_Directive,
  AngularCli_V6_Enum,
  AngularCli_V6_Guard,
  AngularCli_V6_Interface,
  AngularCli_V6_Module,
  AngularCli_V6_Pipe,
  AngularCli_V6_Service,
  AngularCli_V6_Application,
  AngularCli_V6_Library,
  AngularCli_V6_Universal,
} from './generate';

import {
  AngularCli_V6_Build,
  AngularCli_V6_Config,
  AngularCli_V6_Doc,
  AngularCli_V6_E2e,
  AngularCli_V6_Lint,
  AngularCli_V6_New,
  AngularCli_V6_Serve,
  AngularCli_V6_Test,
  AngularCli_V6_Update,
  AngularCli_V6_Xi18n,
  AngularCli_V6_Version
} from './others';

import { AngularCli_Command_Overviews } from './cli-v6-command-overviews';

export const AngularCli_V6: AngularCli = {
  name: '',
  description: 'for Angular 6',
  version: '6.0.0',
  leading: '?',
  workFor: ['4', '5', '6'],
  commands: [
    ...AngularCli_V6_Version,
    ...AngularCli_V6_Component,
    ...AngularCli_V6_Directive,
    ...AngularCli_V6_Pipe,
    ...AngularCli_V6_Service,
    ...AngularCli_V6_Class,
    ...AngularCli_V6_Guard,
    ...AngularCli_V6_Interface,
    ...AngularCli_V6_Enum,
    ...AngularCli_V6_Module,
    ...AngularCli_V6_Application,
    ...AngularCli_V6_Library,
    ...AngularCli_V6_Universal,

    ...AngularCli_V6_Build,
    ...AngularCli_V6_Config,
    ...AngularCli_V6_Doc,
    ...AngularCli_V6_E2e,
    ...AngularCli_V6_Lint,
    ...AngularCli_V6_New,
    ...AngularCli_V6_Serve,
    ...AngularCli_V6_Test,
    ...AngularCli_V6_Update,
    ...AngularCli_V6_Xi18n
  ],
  overviews: [
    ...AngularCli_Command_Overviews
  ]
};
