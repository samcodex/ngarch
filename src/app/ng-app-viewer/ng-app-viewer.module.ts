import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { NgArchUiModule } from 'ng-arch-ui';
import { ToastrModule } from 'ngx-toastr';

import { SharedModule } from '@shared/shared.module';
import { PonentCliComponent } from './diagrams/ponent-cli/ponent-cli.component';
import { NgAppViewerComponent } from './ng-app-viewer/ng-app-viewer.component';
import { ServiceDependencyTreeComponent } from './viewers/service-dependency-tree/service-dependency-tree.component';
import { AppArchViewerComponent } from './viewers/app-arch-viewer/app-arch-viewer.component';
import { AppViewerDataService } from './services/app-viewer-data.service';
import { NgAppViewerService } from './services/ng-app-viewer.service';
import { ArchTianModule } from './../shared/arch-tian/arch-tian.module';
import { ArchDropdownModule } from './../shared/arch-dropdown/arch-dropdown.module';
import { ActivityDiagramComponent } from './diagrams/activity-diagram/activity-diagram.component';
import { StructureDiagramComponent } from './diagrams/structure-diagram/structure-diagram.component';
import { ClassVisualizerComponent } from './diagrams/class-visualizer/class-visualizer.component';
import { ModuleStructureViewerComponent } from './viewers/module-structure-viewer/module-structure-viewer.component';
import { CodeDiagramComponent } from './diagrams/code-diagram/code-diagram.component';
import { ViewerExplanationComponent } from './shared/viewer-explanation/viewer-explanation.component';
import { ViewerGenericUsageComponent } from './shared/viewer-generic-usage/viewer-generic-usage.component';
import { ArchViewerHierarchy } from './viewers/config/arch-viewer-definition';
import { DependencyDiagramComponent } from './diagrams/dependency-diagram/dependency-diagram.component';

// use the last sub-path to indicate the content component,
// use contentHierarchy to indicate the content hierarchy
const routes: Route[] = [
  {
    path: '',
    redirectTo: 'viewer/app-arch/FullView',
    pathMatch: 'full'
  },
  {
    path: 'viewer/app-arch',
    redirectTo: 'viewer/app-arch/FullView',
    pathMatch: 'full'
  },
  {
    path: 'viewer/app-arch/:hierarchy',
    component: NgAppViewerComponent
  },
  {
    path: 'viewer/module-struct',
    component: NgAppViewerComponent
  },
  {
    path: 'viewer/service-dep',
    component: NgAppViewerComponent
  },
  {
    path: 'viewer/component-hierarchy',
    component: NgAppViewerComponent,
    data: {contentHierarchy: ArchViewerHierarchy.ComponentHierarchy}
  },
  {
    path: 'viewer/routing-hierarchy',
    component: NgAppViewerComponent,
    data: {contentHierarchy: ArchViewerHierarchy.RoutingHierarchy}
  }
];

@NgModule({
  imports: [
    CommonModule,
    ToastrModule,
    RouterModule.forChild(routes),
    NgArchUiModule,

    SharedModule.forRoot(),
    ArchTianModule,
    ArchDropdownModule
  ],
  providers: [
    AppViewerDataService
  ],
  declarations: [
    PonentCliComponent,
    NgAppViewerComponent,
    ServiceDependencyTreeComponent,
    AppArchViewerComponent,
    ActivityDiagramComponent,
    StructureDiagramComponent,
    ClassVisualizerComponent,
    ModuleStructureViewerComponent,
    CodeDiagramComponent,
    ViewerExplanationComponent,
    ViewerGenericUsageComponent,
    DependencyDiagramComponent,
  ],
  entryComponents: [
    PonentCliComponent,
    ServiceDependencyTreeComponent,
    AppArchViewerComponent,
    ActivityDiagramComponent,
    StructureDiagramComponent,
    ClassVisualizerComponent,
    ModuleStructureViewerComponent,
    CodeDiagramComponent,
    ViewerExplanationComponent,
    DependencyDiagramComponent
  ],
  exports: [
    ModuleStructureViewerComponent,
    NgAppViewerComponent
  ]
})
export class NgAppViewerModule { }
