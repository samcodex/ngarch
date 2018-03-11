import { ArchNgPonent } from '../../../core/arch-ngponent';

/**
 * group ArchNgPonent by the name of lazy loading module
 *
 * @export
 * @interface ArchNgPonentLoadingGroup
 * @see ArchNgPonent
 */
export interface ArchNgPonentLoadingGroup {
  ngPonentName: string;
  fileName: string;
  isBootstrapGroup: boolean;
  archNgPonents: ArchNgPonent[];
}

/**
 * { groupName: { isBootstrap: boolean, archNgPonents: []}}
 * @export
 * @interface LoadingGroup
 */
export interface LoadingGroups {
  [groupName: string]: ArchNgPonentLoadingGroup;
}
