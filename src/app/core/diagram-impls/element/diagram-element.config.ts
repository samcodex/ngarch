import { AnalysisElementType } from '@core/models/analysis-element';

export type ElementColorType = { [key in AnalysisElementType]?: [string, string] };

export namespace ArchConfig {
  // normal colors
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
    [ AnalysisElementType.Route ]: ['#F67B7B', '#f04949'],
    [ AnalysisElementType._Provider ]: ['#ffa96e', '#fb6702']
  };

  // light theme colors
  export const ElementLightThemeColors: ElementColorType = {
    [ AnalysisElementType.Application ]: ['#FFC0CB', '#C71585'],
    [ AnalysisElementType.Module ]: ['#d4dde9', '#c4d4e8'],
    [ AnalysisElementType.Component ]: ['#dfead4', '#d8eac5'],
    [ AnalysisElementType.Directive ]: ['#ffff99', '#ffff66'],
    [ AnalysisElementType.Pipe ]: ['#dfead4', '#d8eac5'],
    [ AnalysisElementType.Service ]: ['#ffe6e6', '#efd2d0'],
    [ AnalysisElementType.Model ]: ['#ffffb8', '#ffff80'],
    [ AnalysisElementType.Other ]: ['#F6F6E8', '#DADAD8'],
    [ AnalysisElementType.Routes ]: ['#e7c2c2', '#f04949'],
    [ AnalysisElementType.Route ]: ['#e7c2c2', '#f04949'],
    [ AnalysisElementType._Provider ]: ['#ffa96e', '#fb6702']
  };

  export function getElementColors(type: AnalysisElementType, lightTheme = false): [string, string] {
    const theme = lightTheme ? ElementLightThemeColors : ElementColors;
    return theme[type];
  }

  export function getElementColor(type: AnalysisElementType, firstColor = true, lightTheme = false): string {
    const theme = lightTheme ? ElementLightThemeColors : ElementColors;
    const colors = theme[type];
    return colors ? colors[!!firstColor ? 0 : 1] : null;
  }
}
