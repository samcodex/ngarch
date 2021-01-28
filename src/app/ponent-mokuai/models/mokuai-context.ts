import { MetaValue } from '@core/models/meta-data';
import { ElementTypeHelper } from '@core/models/analysis-element';
import { mapElementTypeToNgPonentType } from '@core/diagram-element-linkable';
import { NgPonentType } from '@core/ngponent-tsponent';
import { Params } from '@angular/router';

export class MokuaiContext {
  ngPonentType: NgPonentType;

  private _viewerType: string;                      // The diagram type, module/service/model/route
  private _moduleId: string;                        // the ponent's id, in the url
  private _hostId: string;                          // is same as _viewerId, except for 'Overview' which is the main module
  private _featureType: string;
  private _featureName: string;
  private _params: Params;

  private _isContextUpdated = false;

  constructor() {
  }

  resetContext(viewerType: string, moduleId: string, hostId: string) {
    this._viewerType = viewerType;
    this._moduleId = moduleId;
    this._hostId = hostId;
    this._featureName = null;
    this._featureType = null;

    const elementType = ElementTypeHelper.getElementType(viewerType);
    this.ngPonentType = mapElementTypeToNgPonentType(elementType);
  }

  resetFeature(featureType: string, featureName: string) {
    this._featureType = featureType;
    this._featureName = featureName;
  }

  get isContextUpdated(): boolean {
    return this._isContextUpdated;
  }

  set isContextUpdated(status: boolean) {
    this._isContextUpdated = status;
  }

  get hostId() {
    return this._hostId;
  }

  get viewerId() {
    return this._moduleId;
  }

  get viewerType() {
    return this._viewerType;
  }

  get featureName() {
    return this._featureName;
  }

  get featureType() {
    return this._featureType;
  }

  get isOverview() {
    return this.viewerId.toLocaleLowerCase() === MetaValue.Overview.toLocaleLowerCase();
  }

  get isCompositionView(): boolean {
    return this.featureName === MetaValue.Composition;
  }

  get isDependencyView(): boolean {
    return this.featureName === MetaValue.Dependency;
  }

  get isDetailView(): boolean {
    return this.featureName === null;
  }

  set params(params: Params) {
    this._params = params;
  }

  get params(): Params {
    return this._params;
  }

  hasParam(key: string): boolean {
    return this._params.hasOwnProperty(key);
  }

  getParam(key: string): any {
    return this.hasParam(key) ? this._params[key] : undefined;
  }

  hasParamOf(key: string, value: string): boolean {
    return this.getParam(key) === value;
  }

  get useSvgBoard(): boolean {
    return this.hasParamOf('board', 'SvgBoard');
  }
}
