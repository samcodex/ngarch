import { ClassProvider, FactoryProvider } from '@angular/core';

import { TsPonent } from '../ngponent-tsponent/tsponent';
import { TsPonentType } from '../ngponent-tsponent/tsponent-definition';
import { ArchNgPonent } from '@core/arch-ngponent/arch-ngponent';

export namespace archNgPonentHelper {
  /**
   * ClassProvider: { provide: any, useClass: Type<any>, multi?: boolean }
   */
  export function isClassProvider(provider): provider is ClassProvider {
    return provider.useClass !== undefined;
  }

  /**
   * FactoryProvider: {provide: any, useFactory: Function, deps?: any[], multi?: boolean }
   */
  export function isFactoryProvider(provider): provider is FactoryProvider {
    return provider.useFactory !== undefined;
  }

  export const findCallExpressionPonent = _findCallExpressionPonent;
  export const findIdentifierExpressionPonent = _findIdentifierExpressionPonent;
}

// TsPonentType.CallExpressionPonent
function _findCallExpressionPonent(ponent: TsPonent | ArchNgPonent, callerName?: string): TsPonent {
  return _findSpecificPonent(ponent, TsPonentType.CallExpressionPonent, callerName);
}

function _findIdentifierExpressionPonent(ponent: TsPonent | ArchNgPonent, callerName?: string): TsPonent {
  return _findSpecificPonent(ponent, TsPonentType.IdentifierExpressionPonent, callerName);
}

function _findSpecificPonent(ponent: TsPonent | ArchNgPonent,
    ponentType: TsPonentType, callerName?: string): TsPonent {
  const tsPonent: TsPonent = ponent instanceof ArchNgPonent ? ponent.ngPonent.getTsPonent() : ponent;
  return tsPonent.findMemberWithTypeAndName(ponentType, callerName);
}
