export enum BoardState {
  Initializing = 'Initializing',
  Initialized = 'Initialized',
  Drawn = 'Drawn',
  Drawing = 'Drawing'
}

export enum PlacementStrategy {
  RebuildBoard = 'RebuildBoard',
  ExpandBoard = 'ExpandBoard',
  ZoomBoard = 'ZoomBoard'
}

export interface BoardOptions {
  dropShadowId: string;
}

export enum BoardType {
  SVG = 'svg',
  Canvas = 'canvas'
}
