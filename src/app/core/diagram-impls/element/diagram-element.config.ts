import { AnalysisElementType } from '@core/models/analysis-element';

export type ElementColorType = { [key in AnalysisElementType]?: [string, string] };

export namespace ArchConfig {
  export const ElementColors: ElementColorType = {
    [ AnalysisElementType.Application ]: ['#FFC0CB', '#C71585'],
    [ AnalysisElementType.Module ]: ['#b6d6fc', '#7fb7fa'],
    [ AnalysisElementType.Component ]: ['#dcffb8', '#c3ff85'],
    [ AnalysisElementType.Directive ]: ['#ffff99', '#ffff66'],
    [ AnalysisElementType.Pipe ]: ['#dcffb8', '#c3ff85'],
    [ AnalysisElementType.Service ]: ['#ffe6e6', '#efd2d0'],
    [ AnalysisElementType.Model ]: ['#ffffb8', '#ffff80'],
    [ AnalysisElementType.Other ]: ['#F6F6E8', '#DADAD8'],
    [ AnalysisElementType.Routes ]: ['#F67B7B', '#f04949'],
    [ AnalysisElementType.Route ]: ['#F67B7B', '#f04949']
  };

  export function getElementColors(type: AnalysisElementType): [string, string] {
    return ElementColors[type];
  }

  export function getElementColor(type: AnalysisElementType, firstColor = true): string {
    const colors = ElementColors[type];
    return colors ? colors[!!firstColor ? 0 : 1] : null;
  }
}
