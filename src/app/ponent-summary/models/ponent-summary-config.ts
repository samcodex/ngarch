import { SummarySection, SummaryCategory } from './ponent-summary.model';

export const SummaryData: SummarySection[] = [
  {
    category: SummaryCategory.AllLoadingGroup,
    name: 'AllLoadingGroup',
    title: 'Angular Loading Modules',
    description: '',
    order: 1,
    isDisable: false,
    details: [
      {
        name: null,
        value: 'The main entry module: "#main"'
      },
      {
        name: null,
        value: 'The number of lazy loading module(s): #lazyNumber'
      }
    ],
    items: [{
      name: 'LazyLoadingModules',
      value: [],
      options: {title: 'Lazy loading modules:'}
    }]
  },
  {
    category: SummaryCategory.IsolatedPonent,
    name: 'IsolatedPonent',
    title: 'Unused Elements',
    description: 'not imported/declared in application.',
    order: 2,
    isDisable: true,
    details: [
      {
        name: null,
        value: 'There are #total isolated Angular elements'
      }
    ],
    items: [
      {
        name: 'Modules',
        value: [],
        options: {title: 'Modules:'}
      },
      {
        name: 'Services',
        value: [],
        options: { title: 'Services:', tooltip: 'not declared as provider' }
      },
      {
        name: 'Components',
        value: [],
        options: {title: 'Components:'}
      }
    ]
  },
  {
    category: SummaryCategory.RouteDefinition,
    name: 'RouteDefinition',
    title: 'Route Definition',
    description: '',
    order: 3,
    isDisable: true,
    details: [
      {
        name: null,
        value: 'There are #routeNumber Route definitions'
      }
    ],
    items: [
      {
        name: 'Routes',
        value: [],
        options: {title: 'Routes:'}
      }
    ]
  },
  {
    category: SummaryCategory.BootstrapGroup,
    name: 'BootstrapGroup',
    title: 'Bootstrap Module',
    description: 'Bootstrap Module',
    order: 4,
    isDisable: false,
    details: [
      {
        name: null,
        value: 'There are #moduleTotal module(s), #componentTotal component(s) and #serviceTotal service(s)'
      }
    ],
    items: [
      {
        name: 'Modules',
        value: [],
        options: {title: 'Modules:'}
      },
      {
        name: 'Services',
        value: [],
        options: {title: 'Services:'}
      },
      {
        name: 'Components',
        value: [],
        options: {title: 'Components:'}
      }
    ]
  },
  {
    category: SummaryCategory.LazyLoadingGroup,
    name: 'LazyLoadingGroup',
    title: 'Lazy Loading Module',
    description: 'Lazy Loading Module',
    order: 5,
    isDisable: true,
    details: [
      {
        name: null,
        value: 'There are #moduleTotal module(s), #componentTotal component(s) and #serviceTotal service(s)'
      }
    ],
    items: [
      {
        name: 'Modules',
        value: [],
        options: {title: 'Modules:'}
      },
      {
        name: 'Services',
        value: [],
        options: {title: 'Services:'}
      },
      {
        name: 'Components',
        value: [],
        options: {title: 'Components:'}
      }
    ]
  }
];
