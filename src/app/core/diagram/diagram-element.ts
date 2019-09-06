import { AnalysisElementType } from '@core/models/analysis-element';
import { DiagramElementFeature } from '@core/diagram/diagram-definition';
import { ArchNgPonent } from '@core/arch-ngponent';

export class DiagramElementContext {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

export class DiagramElement<T = any> {
  name: string;
  elementType: AnalysisElementType;
  archPonent: ArchNgPonent;
  elementFeatures: {[key in DiagramElementFeature]?: Function} = {};
  data: T;

  constructor(
    elementType: AnalysisElementType,
    archPonent: ArchNgPonent,
    name?: string
  ) {
    this.elementType = elementType;
    this.archPonent = archPonent;
    this.name = name ? name : archPonent ? archPonent.name : null;
  }

  getName() {
    return this.name;
  }

  getArchNgPonent(): ArchNgPonent {
    return this.archPonent;
  }

  getElementType(): AnalysisElementType {
    return this.elementType;
  }

  addFeature(feature: DiagramElementFeature, callback: Function) {
    if (callback && typeof callback === 'function') {
      this.elementFeatures[feature] = callback;
    }
  }

  getFeatureCallback(feature: DiagramElementFeature): Function {
    return this.elementFeatures[feature];
  }

  setData(data: T) {
    this.data = data;
  }
}
