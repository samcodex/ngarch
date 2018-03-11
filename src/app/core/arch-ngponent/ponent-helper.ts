import get from 'lodash/get';

import { TsPonentType } from './../ngponent-tsponent/tsponent-definition';
import { TsPonent } from './../ngponent-tsponent/tsponent';
import { NgPonent } from './../ngponent-tsponent/ngponent';

export namespace PonentHelper {
  export function iterateTsPonent(tsPonent: TsPonent, type: TsPonentType[]): TsPonent[] {
    if (!tsPonent || !('members' in tsPonent) || !type || !Array.isArray(type) || type.length === 0) {
      return null;
    }

    if (type.length === 1) {
      return tsPonent.members.filter( m => m.ponentType === type[0]);
    } else {
      if (tsPonent.ponentType === type[0]) {
        return tsPonent.members.filter( m => m.ponentType === type[1]);
      }
    }

    return null;
  }

  export function getMembers(tsPonent: TsPonent, type: TsPonentType): TsPonent[] {
    if (tsPonent && tsPonent.ponentType === type && 'members' in tsPonent) {
      return tsPonent.members;
    }
    return null;
  }

  // replace by getMembers
  // export function getMembers_v1(ngPonent: NgPonent): TsPonent[] | null {
  //   let tsPonents: TsPonent[] = null;

  //   const decoratePonent = ngPonent.tsPonent;
  //   if (decoratePonent && decoratePonent.ponentType === TsPonentType.DecoratorPonent) {

  //     const argumentPonent: TsPonent = get(decoratePonent, 'members[0]');
  //     if (argumentPonent && argumentPonent.ponentType === TsPonentType.ArgumentPonent) {

  //       tsPonents = get(argumentPonent, 'members');
  //     }
  //   }

  //   return tsPonents;
  // }
}
