import { Injectable } from '@angular/core';
import { RectangleSize, d3Element } from './../svg/d3.util';
import { findKey, forOwn } from 'lodash';

import { DiagramElementDrawer } from './../diagram-elements/diagram-element-drawer';
import { ArchNgPonentModule } from './../arch-ngponent/arch-ngponent-module';

import { Board } from '../arch-board/board';
import { DiagramElement } from './diagram-element';
import { DiagramElementType, DiagramElementFeature } from '../diagram/diagram-element-definition';

import { TsPonent } from './../ngponent-tsponent/tsponent';
import { NgPonent } from './../ngponent-tsponent/ngponent';
import { ArchNgPonent } from './../arch-ngponent/arch-ngponent';
import { NgPonentType } from './../ngponent-tsponent/ngponent-definition';
import { IDiagramItem } from './diagram-item-interface';

const mappingNgTypes_Element: {[ key in DiagramElementType]: NgPonentType[]} = {
  [DiagramElementType.Module]: [NgPonentType.NgModule],
  [DiagramElementType.Component]: [NgPonentType.Component, NgPonentType.Directive, NgPonentType.Pipe],
  [DiagramElementType.Service]: [NgPonentType.Injectable],
  [DiagramElementType.Model]: [NgPonentType.Model],
  [DiagramElementType.Other]: []
};

@Injectable()
export class DiagramOrganizer {
  private board: Board;
  private elements: DiagramElement[];
  private isDrawn = false;
  elementFeatures: {[key in DiagramElementFeature]?: Function} = {};

  constructor() {
    this.elements = new Array<DiagramElement>();
  }

  setBoard(board: Board): DiagramOrganizer {
    this.board = board;
    return this;
  }

  start() {
    if (this.board) {
      this.board.drawBoard();
      this.isDrawn = true;
    }
  }

  clear() {
    this.board.clear();
    this.elements.length = 0;
  }

  addFeature(feature: DiagramElementFeature, callback: Function) {
    if (callback && typeof callback === 'function') {
      this.elementFeatures[feature] = callback;
    }
  }

  appendData(archNgPonents: ArchNgPonent[] ) {
    const data = Array.isArray(archNgPonents) ? archNgPonents : [archNgPonents];

    data.forEach((archPonent) => {

      if (archPonent) {
        // elementType
        const elementValue: string = findKey(mappingNgTypes_Element, (value) => value.indexOf(archPonent.ngPonentType) > -1);
        const elementType: DiagramElementType = elementValue && elementValue.length > 0
          ? DiagramElementType[elementValue] : DiagramElementType.Other;

        // diagram items, the items which are displayed
        const diagramItems: IDiagramItem[] = archPonent.convertToDiagramItem();

        // diagram element(module/component/directive/service)
        const element: DiagramElement = new DiagramElementDrawer(elementType, archPonent, diagramItems);
        forOwn(this.elementFeatures, (callback, feature) => {
          element.addFeature(feature, callback);
        });

        if (this.isDrawn) {
          this.board.appendElement(element as DiagramElement);
        }
      }
    });

    this.board.drawElements();
  }

  // drawData(element: DiagramElement | d3Element) {
  //   if ('appendTo' in element) {
  //     this.board.presentElement(element as DiagramElement);
  //   } else {
  //     this.board.appendGraph(<d3Element> element);
  //   }
  // }

}
