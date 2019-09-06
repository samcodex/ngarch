import { AnalysisElementType } from '@core/models/analysis-element';
import { MetaValue } from '@core/models/meta-data';
import { UiElementItem } from '@core/models/ui-element-item';
import { MokuaiOptionCategories, MokuaiOptionCatType } from '../models/mokuai-option-model';

const angularElementFilter: UiElementItem[] = [
  { name: 'Module', value: 'module', type: AnalysisElementType.Module, isUsed: true, isDisabled: false, isChecked: true },
  { name: 'Component', value: 'component', type: AnalysisElementType.Component, isUsed: true, isDisabled: false, isChecked: true },
  { name: 'Service', value: 'service', type: AnalysisElementType.Service, isUsed: true, isDisabled: false, isChecked: true },
  { name: 'Directive', value: 'directive', type: AnalysisElementType.Directive, isUsed: true, isDisabled: false, isChecked: true },
  { name: 'Pipe', value: 'pipe', type: AnalysisElementType.Pipe, isUsed: true, isDisabled: false, isChecked: true },
  { name: 'Routes', value: 'routes', type: AnalysisElementType.Routes, isUsed: false, isDisabled: false, isChecked: true }
];

const compositionDetails = ['Including:', '@NgModule/declarations (Module-Component)',
'@NgModule/providers or ModuleWithProviders (Module-Service)', '@NgModule/imports/RouterModule.forRoot/forChild (Module-Routes)',
'@Component/providers(Component-Service)'];
const dependencyDetails = ['Including:', '@NgModule/imports (Module-Module)', 'HTML Template (Component/Directive/Pipe)',
'Component\'s constructor (Component-Service)', 'Service\'s constructor (Service-Service)'];

export const viewerOptionCategories: MokuaiOptionCategories = [
  {
    id: 'relationship',
    name: '(Angular Elements Relationship)',
    type: MokuaiOptionCatType.Relationship,
    description: '',
    items: [
      { name: 'Composition', value: MetaValue.Composition,
        subtitle: 'whole-parts or parent-child/s relationship',
        details: compositionDetails,
        type: null, isUsed: true, isDisabled: false, isChecked: true
      },
      { name: 'Usage Dependency', value: MetaValue.Dependency,
        subtitle: 'dependency injection',
        details: dependencyDetails,
        type: null, isUsed: true, isDisabled: false, isChecked: true
      }
    ]
  },
  {
    id: 'angular',
    name: 'Angular Elements',
    type: MokuaiOptionCatType.Angular,
    description: '',
    items: angularElementFilter
  },
  {
    id: 'self',
    name: 'Specific Elements',
    type: MokuaiOptionCatType.Specific,
    description: '',
    items: [
      { name: 'Module Name', value: MetaValue.Self, type: null, isUsed: true, isDisabled: false, isChecked: true }
    ]
  },
  {
    id: 'connection',
    name: 'Connection',
    type: MokuaiOptionCatType.Connection,
    description: '',
    items: [
      { name: 'All Connections', value: MetaValue.All, type: null, isUsed: true, isDisabled: false, isChecked: true },
      { name: 'Composition', value: 'composition', type: null, isDisabled: true, isChecked: false },
      { name: 'Dependency', value: 'dependency', type: null, isDisabled: true, isChecked: false }
    ]
  },
  {
    id: 'notations',
    name: 'Notation Include',
    type: MokuaiOptionCatType.NotationOption,
    description: '',
    items: [
      { name: '3rd libs, metadata, method & property', value: MetaValue.Complete, type: null, isUsed: true, isDisabled: false, isChecked: false },
      { name: 'Metadata, method & property', value: MetaValue.Application, type: null, isUsed: true, isDisabled: false, isChecked: false },
      { name: 'Name', value: MetaValue.NameOnly, type: null, isUsed: true, isDisabled: true, isChecked: true }
    ]
  },
  {
    id: 'serviceNotations',
    name: 'Angular Service',
    type: MokuaiOptionCatType.ServiceNotation,
    description: '',
    items: [
      { name: 'Dependencies', value: MetaValue.Dependency, type: null, isUsed: true, isDisabled: false, isChecked: true },
      { name: 'Constructor', value: MetaValue.Constructor, type: null, isUsed: true, isDisabled: false, isChecked: false },
      { name: 'Properties', value: MetaValue.Property, type: null, isUsed: true, isDisabled: false, isChecked: false },
      { name: 'Methods', value: MetaValue.Method, type: null, isUsed: true, isDisabled: false, isChecked: false }
    ]
  }
];
