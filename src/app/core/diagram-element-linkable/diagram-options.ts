import { ArchNgPonent } from '@core/arch-ngponent/arch-ngponent';
import { MetaValue } from '@core/models/meta-data';
import { NgPonentType } from '@core/ngponent-tsponent';

/**
 * Relate to ui:
 * PonentMokuaiModule,
 *    hiddenPonentName <-> Self, archNgPonentTypes <-> Angular Element
 *    relationship <-> Relationship, connection <-> Connection
 */
export class DiagramOptions {
  hiddenPonentName?: string[];
  archNgPonentTypes?: NgPonentType[];
  relationship?: any[];
  connection?: any[];
  notationOptions?: MetaValue[];
  serviceNotations?: MetaValue[];

  constructor() { }

  // filter ponent
  filterPonent(archPonent: ArchNgPonent) {
    return !this.isPonentHidden(archPonent.name) && this.hasPonentType(archPonent.ngPonentType);
  }

  // Specific Elements
  isPonentHidden(ponentName: string): boolean {
    const hiddenPonentName = this.hiddenPonentName;
    return hiddenPonentName && hiddenPonentName.length && hiddenPonentName.includes(ponentName);
  }

  // Angular Elements
  hasPonentType(ponentType: NgPonentType): boolean {
    const archNgPonentTypes = this.archNgPonentTypes;
    return !archNgPonentTypes
      || archNgPonentTypes.length === 0
      || archNgPonentTypes.includes(ponentType);
  }

  // Connection
  hasConnectionAll() {
    const connection = this.connection;
    return !connection
      || connection.includes(MetaValue.All);
  }

  // Notation Details
  hasNotationComplete(): boolean {
    const notationOptions = this.notationOptions;
    return notationOptions && notationOptions.includes(MetaValue.Complete);
  }

  hasNotationApplication(): boolean {
    const notationOptions = this.notationOptions;
    return notationOptions && notationOptions.includes(MetaValue.Application);
  }

  hasNotationNameOnly(): boolean {
    const notationOptions = this.notationOptions;
    return !notationOptions
      || notationOptions.length === 0
      || notationOptions.includes(MetaValue.NameOnly);
  }

  // Service Notations
  hasServiceDependencies(): boolean {
    const serviceNotations = this.serviceNotations;
    return !serviceNotations
      || serviceNotations.includes(MetaValue.Dependency);
  }

  hasServiceConstructor(): boolean {
    const serviceNotations = this.serviceNotations;
    return !serviceNotations
      || serviceNotations.includes(MetaValue.Constructor);
  }

  hasServiceProperties(): boolean {
    const serviceNotations = this.serviceNotations;
    return !serviceNotations
      || serviceNotations.includes(MetaValue.Property);
  }

  hasServiceMethods(): boolean {
    const serviceNotations = this.serviceNotations;
    return !serviceNotations
      || serviceNotations.includes(MetaValue.Method);
  }
}
