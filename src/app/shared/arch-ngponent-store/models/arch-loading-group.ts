import { ArchNgPonent } from '@core/arch-ngponent';

/**
 * { groupName: { isBootstrap: boolean, archNgPonents: []}}
 * @export
 * @interface LoadingGroup
 */
export interface LoadingGroups {
  [groupName: string]: ArchNgPonentLoadingGroup;
}


/**
 * group ArchNgPonent by the name of lazy loading module
 *
 * @export
 * @interface ArchNgPonentLoadingGroup
 * @see ArchNgPonent
 */
export class ArchNgPonentLoadingGroup {
  ngPonentName: string;
  fileName: string;
  isBootstrapGroup: boolean;
  archNgPonents: ArchNgPonent[];

  public static createUsedPonentsOfLoadingGroup(group: ArchNgPonentLoadingGroup): ArchNgPonentLoadingGroup {
    const usedPonents = Object.assign({}, group);
    usedPonents.archNgPonents = group.archNgPonents.filter(archNgPonent => !archNgPonent.isIsolatedPonent);

    return usedPonents;
  }

  public static createIsolatedPonentsOfLoadingGroup(group: ArchNgPonentLoadingGroup): ArchNgPonentLoadingGroup {
    const usedPonents = Object.assign({}, group);
    usedPonents.archNgPonents = group.archNgPonents.filter(archNgPonent => archNgPonent.isIsolatedPonent);

    return usedPonents;
  }
}
