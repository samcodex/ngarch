import { InjectionToken } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { d3Element } from '@core/svg/d3-def-types';
import { DiagramLinkableContext } from '@core/diagram-element-linkable/diagram-linkable-context';
import { Board } from './board';
import { LayoutOptions } from '@core/diagram/layout-options';
import { DiagramElementContext, DiagramElement } from './diagram-element';

export abstract class DiagramLayout {
  protected board: Board;
  private ready = new BehaviorSubject(false);

  constructor() {}

  setBoard(board: Board) {
    this.board = board;

    this.afterBoardChange();
  }

  isReady(): Observable<boolean> {
    return this.ready.asObservable();
  }

  protected get rootSvg(): d3Element {
    return this.board.rootSvg;
  }

  protected get rootGroup(): d3Element {
    return this.board.rootGroup;
  }

  protected get styles(): d3Element {
    return this.board.styles;
  }

  protected updateStatusNotReady() {
    this.ready.next(false);
  }

  protected updateStatusReady() {
    this.ready.next(true);
  }

  protected get boardSize() {
    const board = this.board;
    const boardSize = board.getBoardSize();
    const { width, height } = boardSize;
    return { width, height };
  }

  // abstract method
  abstract drawLayout(elementContext: DiagramElementContext | DiagramElement | DiagramElement[], layoutOptions?: LayoutOptions): void;

  // empty method, can be @override
  afterBoardChange(): void {}

  // empty method, can be @override
  stopLayout(): void { }
}

export const DiagramLayoutToken = new InjectionToken('Diagram Layout');
