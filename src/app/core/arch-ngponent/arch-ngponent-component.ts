import { NgPonentType } from './../ngponent-tsponent/ngponent-definition';
import { TsPonent } from './../ngponent-tsponent/tsponent';
import { NgPonent } from './../ngponent-tsponent/ngponent';
import { ArchNgPonent } from './../arch-ngponent/arch-ngponent';
import { IArchNgPonentMetadata } from './../arch-ngponent/arch-ngponent-metadata-interface';


export class NgComponentMetadata implements IArchNgPonentMetadata {
  ngPonentType: NgPonentType = NgPonentType.Component;
  properties = ['changeDetection', 'viewProviders', 'moduleId',
    'templateUrl', 'template', 'styleUrls', 'styles', 'animations',
    'encapsulation', 'interpolation', 'entryComponents', 'preserveWhitespaces',
    'selector', 'inputs', 'outputs', 'host', 'providers', 'exportAs', 'queries'];
  usedProperties = [];

  changeDetection?: number | string;
  viewProviders?: any[];
  moduleId?: string;
  templateUrl?: string;
  template?: string;
  styleUrls?: string[];
  styles?: string[];
  animations?: any[];
  encapsulation?: number | string;
  interpolation?: [string, string];
  entryComponents?: Array<Array<any> | any[]>;
  preserveWhitespaces?: boolean;
  selector?: string;
  inputs?: string[];
  outputs?: string[];
  host?: {[key: string]: string};
  providers?: any[];
  exportAs?: string;
  queries?: {[key: string]: any};

  descriptions = {
      changeDetection: 'change detection strategy used by this component',
      viewProviders: 'list of providers available to this component and its view children',
      moduleId: 'ES/CommonJS module id of the file in which this component is defined',
      // templateUrl: 'url to an external file containing a template for the view',
      'template': 'inline-defined template for the view',
      'styleUrls': 'list of urls to stylesheets to be applied to this component\'s view',
      'styles': 'inline-defined styles to be applied to this component\'s view',
      'animations': 'list of animations of this component',
      'encapsulation': 'style encapsulation strategy used by this component',
      'interpolation': 'custom interpolation markers used in this component\'s template',
      'entryComponents': 'list of components that are dynamically inserted into the view of this component',
      'preserveWhitespaces': '',
      'selector': 'css selector that identifies this component in a template',
      'inputs': 'list of class property names to data-bind as component inputs',
      'outputs': 'list of class property names that expose output events that others can subscribe to',
      'host': 'map of class property to host element bindings for events, properties and attributes',
      'providers': 'list of providers available to this component and its children',
      'exportAs': 'name under which the component instance is exported in a template',
      'queries': 'configure queries that can be injected into the component',
  };
}

export class ArchNgPonentComponent extends ArchNgPonent {

  constructor(
    name: string,
    ngPonent: NgPonent,
    tsPonent: TsPonent
  ) {
    super(name, ngPonent, tsPonent, new NgComponentMetadata());
  }

}
