import { InjectorTreeNode } from '@core/diagram-tree/injector-tree';
import { Injectable, ComponentFactoryResolver } from '@angular/core';
import { NgArchUiService, ArchUi, ArchUiType, ArchPartTheme } from 'ng-arch-ui';
import { ToastrService } from 'ngx-toastr';

import { AnalysisElementType } from '@core/models/analysis-element';
import { ArchNgPonent } from '@core/arch-ngponent';
import { mapNgPonentTypeToElementType } from '@core/diagram-element-linkable';
import { ViewPurposeToUiClass, PonentActionPurpose, findPonentViewerUiClass } from '../models/viewer-content-types';
import { PonentActionItem } from '../models/viewer-content-types';
import { TypeOfViewerComponentMap, ViewerType, getNgAppViewerTypeByPath, DiagramViewerType } from '../models/ng-app-viewer-definition';
import { DiagramTreeNode } from '@core/diagram-tree/diagram-tree-node';
import { ArchViewerHierarchy } from '../viewers/config/arch-viewer-definition';

const uiPanelElementTheme: ArchPartTheme = {
  Header: {
    Focus: {
      background_color: '#d1def7'
    },
    FocusOut: {
      background_color: '#e4e4e4'
    }
  }
};

const uiElementThemes: { [ key in ArchUiType]?: ArchPartTheme } = {
  [ ArchUiType.Panel ]: uiPanelElementTheme,
  [ ArchUiType.Window ]: null
};

const getUiCreator = (uiType: ArchUiType) =>
  uiType === ArchUiType.Panel ? ArchUi.createPanelWithContentComponent : ArchUi.createWindowWithContentComponent ;

@Injectable({
  providedIn: 'root'
})
export class NgAppViewerService {
  private mapOfTypeToUiClass: ViewPurposeToUiClass[];
  private mainViewer: ViewerType;
  private mapOfViewer: TypeOfViewerComponentMap;
  private contentHierarchy: ArchViewerHierarchy;

  constructor(
    private ngArchUiService: NgArchUiService,
    private toastr: ToastrService
  ) { }

  initializeMainViewer(resolver: ComponentFactoryResolver, viewerId: string, contentHierarchy: ArchViewerHierarchy,
      mapOfViewerCom: TypeOfViewerComponentMap, mapOfPanelClass: ViewPurposeToUiClass[]) {
    // initialize service
    this.mapOfTypeToUiClass = mapOfPanelClass;
    this.mapOfViewer = mapOfViewerCom;
    this.mainViewer = getNgAppViewerTypeByPath(viewerId);
    this.contentHierarchy = contentHierarchy;

    // register resolver
    this.ngArchUiService.registerResolver(resolver);

    // initialize desktop
    const clazz = this.mapOfViewer[this.mainViewer];
    this.ngArchUiService.assignDesktopComponentClass(clazz);
  }

  // since the viewer content component is set in method 'initializeMainViewer',
  // contentHierarchy is already set and can be accessed by the content component
  getContentHierarchy(): ArchViewerHierarchy {
    return this.contentHierarchy;
  }

  // createWindowOnDesktop(elementType: AnalysisElementType, title: string, transferData: object ): ArchWindow {
  //   const clazz = this.mapOfPanelClass[elementType];
  //   // 1. create new window
  //   // 2. assign new window the content component
  //   const archWindow = ArchUi.createArchWindowWithContentComponent(title, clazz);

  //   // 3. append the new window to the host desktop
  //   // 4. render the new window
  //   this.ngArchUiService.renderNewUiElementToDesktop(archWindow, transferData);

  //   return archWindow;
  // }


  openNgPonentOnTop(node: DiagramTreeNode | InjectorTreeNode, purpose: PonentActionPurpose, fromViewer: ViewerType | DiagramViewerType,
      uiData?: any, options?: any) {
    const item: ArchNgPonent = node.getArchNgPonent();
    const ponentType = item.ngPonentType;
    const elementType = mapNgPonentTypeToElementType(ponentType);
    const title = node.name + ` - ${purpose}`;
    const data = uiData || (node instanceof DiagramTreeNode ? node.archNode : null) || item;
    const transferData = { data, fromViewer, options };
    const uiType = elementType === AnalysisElementType.Module ? ArchUiType.Window : ArchUiType.Panel;

    this.openUiElementOnTop(uiType, elementType, purpose, title, transferData);
  }

  openWindowByPonentAction(item: PonentActionItem, fromViewer: ViewerType | DiagramViewerType, uiData?: any, options?: any) {
    const { name: viewName, type, value: purpose, data: diagramElement } = item;
    // const data = uiData ? uiData : (diagramElement as DiagramTreeNode).archNode;
    // const transferData = { data, options };
    // const title = diagramElement.name + ' - ' + viewName;

    // this.openUiElementOnTop(null, <AnalysisElementType>type, purpose, title, transferData);

    this.openNgPonentOnTop(<DiagramTreeNode>diagramElement, purpose, fromViewer, uiData, options);
  }

  openViewerExplanationPanel(viewerType: ArchViewerHierarchy | ViewerType | DiagramViewerType) {
    const transferData = { fromViewer: viewerType };
    this.openUiElementOnTop(null, null, PonentActionPurpose.ViewerExplanation, 'Viewer Explanation', transferData);
  }

  private openUiElementOnTop(uiType: ArchUiType, elementType: AnalysisElementType, purpose: PonentActionPurpose,
    title: string, transferData: object) {

    const uiClass = this.findUiClass(elementType, purpose);
    if (uiClass) {
      const { clazz, archUiOptions, resolve } = uiClass;
      const usedUiType: ArchUiType = uiType || uiClass.uiType;

      if (clazz) {
        const archWindow = getUiCreator(usedUiType)(title, clazz);
        const passingData = Object.assign({}, resolve, transferData);

        this.ngArchUiService.renderElementOnTop(archWindow, passingData, archUiOptions, uiElementThemes[usedUiType]);
      } else {
        console.error(`Cannot find the viewer class of '${elementType}'(type) and '${purpose}'(purpose)! Please check the configuration of ViewPurposeToUiClass[]`);
      }
    } else {
      this.toastr.warning(`Cannot find the viewer configuration for "${elementType}" & "${purpose}"`, 'Development Issue')
    }
  }

  private findUiClass(type?: AnalysisElementType, purpose?: PonentActionPurpose): ViewPurposeToUiClass {
    return findPonentViewerUiClass(this.mapOfTypeToUiClass, type, purpose) ;
  }
}
