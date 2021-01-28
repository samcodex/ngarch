export enum MetaValue {
  Self = 'Self',
  Overview = 'Overview',
  All = 'All',
  Internal = 'Internal',
  External = 'External',
  Any = 'Any',
  None = 'None',
  Yes = 'Yes',
  No = 'No',
  Decorator = 'Decorator',
  Typescript = 'Typescript',
  Application = 'Application',
  Complete = 'Complete',
  NameOnly = 'NameOnly',
  Connection = 'Connection',
  Method = 'Method',
  Property = 'Property',
  Constructor = 'Constructor',
  Dependency = 'Dependency',
  Composition = 'Composition'
}

export enum MapDataCallbackFlag {
  MapDiagramContent = 'mapDiagramContent',
}

export enum LayoutCallbackFlag {
  HierarchyChildrenAccessor = 'hierarchyChildrenAccessor'
}

export type CallbackFlags = LayoutCallbackFlag | MapDataCallbackFlag;

export type Callbacks = { [key in CallbackFlags]?: Function | [Function, any] };

export const hasCallback = (callbacks: Callbacks, state: CallbackFlags) => callbacks && callbacks.hasOwnProperty(state);

export const getCallback = (callbacks: Callbacks, state: CallbackFlags) => hasCallback(callbacks, state) ? callbacks[state] : null;

export const setCallback = (callbacks: Callbacks, state: CallbackFlags, value: any) => callbacks[state] = value;
