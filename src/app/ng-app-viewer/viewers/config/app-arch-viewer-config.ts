import { UiElementCategory, UiElementSection } from '@core/models/ui-element-category';
import { MetaInputType } from '@config/meta-config';
import { UiElementItem } from '@core/models/ui-element-item';
import { Orientation } from '@core/diagram/layout-options';
import { ArchViewerOptionCategory, ArchViewerNodeType, ArchViewerType, ArchViewerExtraContent, ArchViewerHierarchy } from './arch-viewer-definition';

const compositionDetails = ['Including:', '@NgModule/declarations (Module-Component)',
'@NgModule/providers or ModuleWithProviders (Module-Service)', '@NgModule/imports/RouterModule.forRoot/forChild (Module-Routes)',
'@Component/providers(Component-Service)'];
const dependencyDetails = ['Including:', '@NgModule/imports (Module-Module)', 'HTML Template (Component/Directive/Pipe)',
'Component\'s constructor (Component-Service)', 'Service\'s constructor (Service-Service)'];


const filterByUsed = (item: UiElementItem) => item.isUsed !== false;

const hierarchyOptions: UiElementCategory[] = [
  {
    id: 'hierarchy',
    name: 'Hierarchy',
    type: ArchViewerOptionCategory.Hierarchy,
    inputType: MetaInputType.RadioGroup,
    items: [
      { name: 'Full View', value: ArchViewerHierarchy.FullView,
        type: null, isChecked: true
      },
      { name: 'Component Hierarchy', value: ArchViewerHierarchy.ComponentHierarchy,
        type: null, isChecked: false
      },
      { name: 'Routing Hierarchy', value: ArchViewerHierarchy.RoutingHierarchy,
        type: null, isChecked: false
      },
      { name: 'Injector Hierarchy', value: ArchViewerHierarchy.InjectorHierarchy,
        type: null, isChecked: false
      }
    ].filter(filterByUsed)
  }
];

const viewerOptions: UiElementCategory[] = [
  {
    id: 'orientation',
    name: 'Orientation',
    type: ArchViewerOptionCategory.Orientation,
    inputType: MetaInputType.RadioGroup,
    items: [
      { name: 'Top-to-Bottom', value: Orientation.TopToBottom,
        type: null, isChecked: true
      },
      { name: 'Left-to-Right', value: Orientation.LeftToRight,
        type: null, isChecked: false
      }
    ].filter(filterByUsed)
  },
  // {
  //   id: 'tree_node',
  //   name: 'Tree Nodes',
  //   type: ArchViewerOptionCategory.TreeNodes,
  //   items: [
  //     { name: 'Include Routes', value: ArchViewerNodeType.IncludeRoutes,
  //       type: null, isChecked: false
  //     }
  //   ].filter(filterByUsed)
  // },
  {
    id: 'viewer_type',
    name: 'Type',
    type: ArchViewerOptionCategory.ViewerType,
    description: '',
    inputType: MetaInputType.RadioGroup,
    items: [
      { name: 'Route Tree', value: ArchViewerType.RoutesTree,
        type: null, isChecked: true
      },
      { name: 'Full Route-Component Tree', value: ArchViewerType.FullRouteComponentTree,
        type: null, isChecked: false, isUsed: true, isDisabled: true
      }
    ].filter(filterByUsed)
  }
];

const viewerServiceOptions: UiElementCategory[] = [
  {
    id: 'service',
    name: 'Service',
    type: ArchViewerOptionCategory.ExtraService,
    description: '',
    items: [
      { name: 'Service Provider', value: ArchViewerExtraContent.LayerServiceProvider,
        type: null, isChecked: false
      }
    ].filter(filterByUsed)
  }
];

// const viewerUsage: UiElementCategory[] = [
//   {
//     id: 'relationship',
//     name: '(Angular Elements Relationship)',
//     type: '',
//     items: [
//       { name: 'Composition', value: null,
//         subtitle: 'whole-parts or parent-child/s relationship',
//         details: compositionDetails,
//         type: null, isUsed: false, isDisabled: false, isChecked: true
//       },
//       { name: 'Usage Dependency', value: null,
//         subtitle: 'dependency injection',
//         details: dependencyDetails,
//         type: null, isUsed: false, isDisabled: false, isChecked: true
//       }
//     ].filter(filterByUsed)
//   }
// ];

// const viewerDescription: UiElementCategory[] = [

// ];

export const appViewerOptions: UiElementSection[] = [
  {
    name: 'Hierarchies',
    id: 'hierarchies',
    type: 'hierarchies',
    categories: hierarchyOptions
  },
  {
    name: 'Tree Options',
    id: 'options',
    type: 'options',
    categories: viewerOptions
  },
  {
    name: 'Tree Content',
    id: 'serviceOptions',
    type: 'ServiceOptions',
    categories: viewerServiceOptions
  }
  // ,
  // {
  //   name: 'Usage',
  //   id: 'usage',
  //   type: 'usage',
  //   categories: viewerUsage
  // },
  // {
  //   name: 'Description',
  //   id: 'description',
  //   type: 'description',
  //   categories: viewerDescription
  // }
];
