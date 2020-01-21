import { Injectable, Inject, Optional } from '@angular/core';
import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DiagramElementBuilder, MapOfDiagramElementBuilder, createElementBuilder, ElementBuilderConstructor } from './element-builder';
import { ArchNgPonent } from '@core/arch-ngponent';
import { DiagramOptions } from '@core/diagram-element-linkable';
import { Board } from '@core/diagram/board';
import { DiagramElement } from '@core/diagram/diagram-element';
import { ArchNgPonentStore } from '@shared/arch-ngponent-store/arch-ngponent-store';
import { ArchStoreData } from '@shared/arch-ngponent-store';
import { DiagramLayoutToken, DiagramLayout } from './diagram-layout';
import { DiagramLinkableContext } from '@core/diagram-element-linkable/diagram-linkable-context';
import { Callbacks, MapDataCallbackFlag, getCallback } from './../models/meta-data';
import { ArchTree, ArchNode } from '@core/arch-tree/arch-tree';
import { LayoutOptions, LayoutFeature } from '@core/diagram/layout-options';
import { DiagramElementFeature } from '@core/diagram/diagram-definition';
import { DiagramTreeContext } from '@core/diagram-tree/diagram-tree-context';
import { DiagramTreeNode } from '@core/diagram-tree/diagram-tree-node';

@Injectable()
export class DiagramOrganizer {
  private board: Board;
  private elementFeatures: {[key in DiagramElementFeature]?: Function} = {};
  private _features_keys: DiagramElementFeature[];

  private isDrawLine = true;

  private elementBuilder: ElementBuilderConstructor = MapOfDiagramElementBuilder.Default;
  private diagramLayout: DiagramLayout;

  constructor(
    private store: ArchNgPonentStore,
    @Inject(DiagramElementBuilder) @Optional() elementBuilder: ElementBuilderConstructor,
    @Inject(DiagramLayoutToken) @Optional() diagramLayout: DiagramLayout,
  ) {
    if (diagramLayout) {
      this.diagramLayout = diagramLayout;
    }
    if (elementBuilder) {
      this.elementBuilder = elementBuilder;
    }
  }

  setBoard(board: Board, isDrawBoard = false) {
    this.board = board;

    if (!!isDrawBoard) {
      this.board.drawBoard();
    }
  }

  getBoard(): Board {
    return this.board;
  }

  setElementBuilder(builder: ElementBuilderConstructor) {
    this.elementBuilder = builder;
  }

  setDiagramLayout(layout: DiagramLayout) {
    this.diagramLayout = layout;
  }

  getDiagramLayout(): DiagramLayout {
    return this.diagramLayout;
  }

  centerFirstNgPonent(isCenter: boolean) {
    this.board.isFirstAtCenter = isCenter;
  }

  start() {
    if (this.board) {
      this.board.drawBoard();
    }
  }

  clear() {
    this.board.clear();
  }

  addFeature(feature: DiagramElementFeature, callback: Function) {
    if (callback && typeof callback === 'function') {
      this.elementFeatures[feature] = callback;
      this._features_keys = Object.keys(this.elementFeatures).map(key => DiagramElementFeature[key]);
    }
  }

  setIsDrawLine(isDrawLine: boolean) {
    this.isDrawLine = isDrawLine;
  }

  drawDiagramTreeNodeWithLayout(diagramNode: DiagramTreeNode, layoutOptions?: LayoutOptions) {
    if (!this.diagramLayout) {
      console.error('Please inject the related layout');
    }

    this.board.resetBoardContext(layoutOptions);
    this.diagramLayout.setBoard(this.board);
    this.diagramLayout.drawLayout(diagramNode, layoutOptions);
  }

  drawArchTreeWithLayout(layoutData: ArchTree | ArchNode, traverseTreeContext?: (DiagramTreeContext) => void,
      mapNodeFn?: Function, layoutOptions?: LayoutOptions) {
    if (!this.diagramLayout) {
      console.error('Please inject the related layout');
    }
    let archTree: ArchTree;
    if (layoutData instanceof ArchNode ) {
      archTree = new ArchTree(layoutData.name, null);
      archTree.archRoot = layoutData;
    } else {
      archTree = layoutData;
    }

    const hasInjectorLayer = layoutOptions.features && layoutOptions.features.includes(LayoutFeature.SecondaryLayerForInjector);
    const diagramTree = new DiagramTreeContext(archTree, mapNodeFn, hasInjectorLayer);
    if (traverseTreeContext) {
      traverseTreeContext(diagramTree);
    }

    // assign element features
    if (this._features_keys) {
      diagramTree.traverse((node: DiagramTreeNode) => {
        this.assignElementFeatures(node);
      });

      diagramTree.traverseInjectorTree((node: DiagramTreeNode) => {
        this.assignElementFeatures(node);
      });

      diagramTree.traverseDependencyTree((node: DiagramTreeNode) => {
        this.assignElementFeatures(node);
      });
    }

    this.board.resetBoardContext(layoutOptions);
    this.diagramLayout.setBoard(this.board);
    this.diagramLayout.drawLayout(diagramTree, layoutOptions);
  }

  drawArchPonentWithLayout(archNgPonents: ArchNgPonent[], diagramOptions: DiagramOptions = null,
      layoutOptions?: LayoutOptions, mapDataCallbacks: Callbacks = null) {
    let contentSource: Observable<DiagramLinkableContext>;

    // convert data to diagram content first time
    if (diagramOptions && isRelatedToStoreData(diagramOptions)) {
      contentSource = this.store.getValidStoreData()
        .pipe(
          map(storeData => this.generateDiagramContent(archNgPonents, diagramOptions, storeData))
        );
    } else {
      const diagramContent = this.generateDiagramContent(archNgPonents, diagramOptions);
      contentSource = of(diagramContent);
    }

    // convert diagram content second time
    const mapDiagramContentAgainByComponent = (diagramContent: DiagramLinkableContext) => {
      const callback = getCallback(mapDataCallbacks, MapDataCallbackFlag.MapDiagramContent) as Function;
      if (callback) {
        const params = [ diagramContent ];
        let fn: Function;
        if (Array.isArray(callback)) {
          fn = callback[0];
          params.push(callback[1]);
        } else {
          fn = callback;
        }
        return fn.apply(null, params);
      } else {
        return diagramContent;
      }
    };

    // draw layout
    contentSource
      .pipe(
        map(mapDiagramContentAgainByComponent)
      )
      .subscribe((diagramContent) => {
        if (this.diagramLayout) {
          this.board.resetBoardContext(layoutOptions);
          this.diagramLayout.setBoard(this.board);
          this.diagramLayout.drawLayout(diagramContent, layoutOptions);
        } else {
          this.drawDiagramElementsDirectly(diagramContent, diagramOptions);
        }
      });

    // if (this.diagramLayout) {
    //   this.diagramLayout.drawLayout(archNgPonents, diagramOptions);
    // } else {
    //   if (diagramOptions && isRelatedToStoreData(diagramOptions)) {
    //     this.store.getValidStoreData()
    //       .subscribe(storeData => {
    //         this._appendDataWithStoreData(archNgPonents, diagramOptions, storeData);
    //       });
    //   } else {
    //     this._appendDataWithStoreData(archNgPonents, diagramOptions);
    //   }
    // }
  }

  /**
   * 0. board is set and is drawn. Then, require: ArchNgPonent[], DiagramOptions, ArchStoreData
   * 1. Convert ArchNgPonent[] to drawable-DiagramElement
   * 2. Append drawable-DiagramElement[] to board
   * 3. Invoke board to append drawable-links
   * 4. Invoke board to draw links
   */
  // private _appendDataWithStoreData(
  //   archNgPonents: ArchNgPonent[],
  //   diagramOptions: DiagramOptions = null,
  //   storeData: ArchStoreData = null
  // ) {
  //   // diagram element
  //   const data = diagramOptions
  //     ? archNgPonents.filter(diagramOptions.filterPonent.bind(diagramOptions))
  //     : archNgPonents;
  //   const clazz = this.elementBuilder;

  //   data
  //     .forEach((archPonent) => {
  //       // diagram element(module/component/directive/service)
  //       const convertor = createElementBuilder(clazz, archPonent, diagramOptions, storeData);
  //       const element = convertor.convertToDiagramElement();

  //       forOwn(this.elementFeatures, (callback, feature: DiagramElementFeature) => {
  //         element.addFeature(feature, callback);
  //       });

  //       if (this.isDrawn) {
  //         this.board.appendElement(element as DiagramElement);
  //       }
  //   });

  //   this.board.drawElements();

  //   // diagram line
  //   if (diagramOptions) {
  //     this.setIsDrawLine(diagramOptions.hasConnectionAll());
  //   }

  //   if (this.isDrawLine) {
  //     this.board.drawLines();
  //   }
  // }

  /**
   * 1. Append drawable-DiagramElement[] to board
   * 2. Invoke board to append drawable-links
   * 3. Invoke board to draw links
   */
  private drawDiagramElementsDirectly(
    elementContext: DiagramLinkableContext,
    diagramOptions: DiagramOptions = null,
  ) {
    this.board.drawElements();

    // diagram line
    if (diagramOptions) {
      this.setIsDrawLine(diagramOptions.hasConnectionAll());
    }

    if (this.isDrawLine) {
      this.board.drawLines();
    }
  }

  /**
   * 1. Convert ArchNgPonent[] to drawable-DiagramElement
   */
  private generateDiagramContent(
      archNgPonents: ArchNgPonent[],
      diagramOptions: DiagramOptions = null,
      storeData: ArchStoreData = null): DiagramLinkableContext {
    // diagram element
    const data = diagramOptions
      ? archNgPonents.filter(diagramOptions.filterPonent.bind(diagramOptions))
      : archNgPonents;
    const clazz = this.elementBuilder;
    const diagramContext = this.board.getDiagramContext();

    data
      .forEach((archPonent) => {
        // diagram element(module/component/directive/service)
        const convertor = createElementBuilder(clazz, archPonent, diagramOptions, storeData);
        const element = convertor.convertToDiagramElement();
        if (this._features_keys) {
          this.assignElementFeatures(element);
        }
        diagramContext.appendElement(element);
    });

    diagramContext.buildLinks();

    return diagramContext;
  }

  private assignElementFeatures(element: DiagramElement) {
    if (this._features_keys) {
      this._features_keys.forEach(feature => {
        const callback = this.elementFeatures[feature];
        element.addFeature(feature, callback);
      });
    }
  }
}

function isRelatedToStoreData(diagramOptions: DiagramOptions) {
  const { notationOptions } = diagramOptions;
  return notationOptions && notationOptions.length;
}
