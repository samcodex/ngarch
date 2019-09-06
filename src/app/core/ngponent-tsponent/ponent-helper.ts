import { forEach, get } from 'lodash-es';

import { TsPonent } from './tsponent';
import { TsPonentType } from './tsponent-definition';

export namespace PonentHelper {
  export function filterTsPonentMembersByType(tsPonent: TsPonent, type: TsPonentType[]): TsPonent[] {
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

  export function getTsPonentMembers(tsPonent: TsPonent, ponentTypes: TsPonentType[]): TsPonent[] {
    let members: TsPonent[] = null;
    let searching: TsPonent[] = [tsPonent];

    forEach(ponentTypes, (type: TsPonentType) => {
      searching = members = _getMembers(searching, type);
      if (!searching) {
        return false;
      }
    });

    return members;
  }

  export function findTsPonentByType(tsPonent: TsPonent, ponentTypes: TsPonentType[], ponentNames?: string[]): TsPonent {
    let foundTsPonent: TsPonent = null;
    let searching: TsPonent[] = [tsPonent];
    const typesLength = ponentTypes && Array.isArray(ponentTypes) ? ponentTypes.length : 0;
    const namesLength = ponentNames && Array.isArray(ponentNames) ? ponentNames.length : 0;
    const length = Math.max(typesLength, namesLength);

    for (let i = 0; i < length; i++) {
      const type = i < typesLength ? ponentTypes[i] : null;
      const ponentName = i < namesLength ? ponentNames[i] : null;

      const found = _findTsPonent(searching, type, ponentName);

      if (i === length - 1) {
        foundTsPonent = found;
      } else {
        searching = found ? get(found, 'members', null) : null;

        if (!searching) {
          break;
        }
      }
    }

    return foundTsPonent;
  }
}

function _getMembers(tsPonent: TsPonent | TsPonent[], type: TsPonentType): TsPonent[] {
  const foundTsPonent = _findTsPonent(tsPonent, type);
  return foundTsPonent ? get(foundTsPonent, 'members', null) : null;
}

function _findTsPonent(tsPonent: TsPonent | TsPonent[], type: TsPonentType, ponentName?: string): TsPonent {
  if (!!tsPonent) {
    const tmpPonents: TsPonent[] = Array.isArray(tsPonent) ? tsPonent : [tsPonent];
    return tmpPonents.find(ponent => ponent
        && type ? ponent.ponentType === type : true
        && ponentName ? ponent.name === ponentName : true);
  } else {
    return null;
  }
}


// function _getIdentifierTypeTsPonents(tsPonent: TsPonent, ponentTypes: TsPonentType[]): TsPonent[] {
//   const lastType = last(ponentTypes);
//   const tsPonents = PonentHelper.getTsPonentMembers(tsPonent, ponentTypes);
//   return tsPonents ? tsPonents.filter(ponent => ponent.ponentType === TsPonentType.IdentifierExpressionPonent) : null;
// }

// function _getTsPonentIdentifierNames(tsPonent: TsPonent, ponentTypes: TsPonentType[]): string[] {
//   let names = null;
//   const members = _getIdentifierTypeTsPonents(tsPonent, ponentTypes);
//   if (members) {
//     // TODO, should use member.name;
//     names = members.map(member => member.value);
//     // names = members.map(member => member.name);
//   } else {
//     names = null;
//   }

//   return names;
// }
