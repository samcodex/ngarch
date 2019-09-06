import { AppArchViewerComponent } from '../viewers/app-arch-viewer/app-arch-viewer.component';
import { ServiceDependencyTreeComponent } from '../viewers/service-dependency-tree/service-dependency-tree.component';
import { TypeOfViewerComponentMap, ViewerType } from './ng-app-viewer-definition';
import { ModuleStructureViewerComponent } from '../viewers/module-structure-viewer/module-structure-viewer.component';

export const mapOfNgAppViewer: TypeOfViewerComponentMap = {
  [ ViewerType.AppArchViewer ]: AppArchViewerComponent,
  [ ViewerType.ModuleStructureTree ] : ModuleStructureViewerComponent,
  [ ViewerType.ServiceDependencyTree ]: ServiceDependencyTreeComponent
};
