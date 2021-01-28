import { ArchStoreData } from '../models/arch-store-data';
import { ArchNgPonent } from '@core/arch-ngponent/arch-ngponent';
import { TsPonent } from '@core/ngponent-tsponent/tsponent';
import { TsPonentType } from '@core/ngponent-tsponent/tsponent-definition';

export class ArchResolver {
  private importIndexes: TsIndex[] = [];
  private variablesIndexes: TsIndex[] = [];

  constructor(
    private store: ArchStoreData
  ) {}

  clear() {
    this.importIndexes.length = 0;
    this.variablesIndexes.length = 0;
  }

  updateIndex(tsPonents: TsPonent[]) {
    const tsImports = tsPonents
      .filter(tsPonent => tsPonent.ponentType === TsPonentType.ImportPonent)
      .map(tsPonent => new TsIndex(tsPonent));
    this.importIndexes.length = 0;
    this.importIndexes.push.apply(this.importIndexes, tsImports);

    const tsVariables = tsPonents
      .filter(tsPonent => tsPonent.ponentType !== TsPonentType.ImportPonent)
      .map(tsPonent => new TsIndex(tsPonent));
    this.variablesIndexes.length = 0;
    this.variablesIndexes.push.apply(this.variablesIndexes, tsVariables);
  }

  resolveArchNgPonent(hostFilename: string, name: string): ArchNgPonent {
    // const resolveItem = this.findImportIndex(hostFilename, name);
    const resolveItem = this.findDependencyInModule(hostFilename, name)
      || this.findDependencyComponent(hostFilename, name);

    if (resolveItem) {
      let resolvedPonent = this.store.findPonentByName(name, resolveItem.importedFile);
      if (!resolvedPonent) {
        const relatedFilename = resolveItem.tsPonent.getOption('relateFileName');
        resolvedPonent = this.store.tryFindModulePonentByName(name, relatedFilename);
      }
      return resolvedPonent;
    } else {
      // console.log(name, ' **-- ', this.findVariableIndex(hostFilename, name));
      // console.log(name, ' ---- ', this.importIndexes.find(index => index.host === hostFilename));
      // console.log(name, ' ??-- ', this.importIndexes.find(index => index.tsName === name));
    }

    return null;
  }

  private findImportIndex(host: string, requestedId: string): TsIndex {
    const a = this.importIndexes.find(index => index.host === host && index.importedIdentifier === requestedId);
    const b = this.importIndexes
      .find(index => (index.host === host ) && index.importedIdentifier === requestedId);

    console.log('**==>', host, ' - ', requestedId, ' - ', a, ' - ', b);
    // return this.importIndexes.find(index => index.host === host && index.tsName === tsName);
    // const hosts = this.importIndexes
    //   .filter(index => index.host === host || index.filename === host);
    const hosts = this.importIndexes.filter(index => index.importedFile === host);
    const hostName = hosts && hosts.length ? hosts[0].host : host;

    return this.importIndexes
      .filter(index => index.host === hostName)
      .find(index => index.importedIdentifier === requestedId);
  }

  private findDependencyInModule(host: string, requestedIdentifier: string): TsIndex {
    const test = this.importIndexes.filter(index => index.host === host && index.importedIdentifier === requestedIdentifier);
if (test.length >= 2) {
  console.log('duplicated - findDependencyInModule', host, requestedIdentifier, test);
}
    return this.importIndexes.find(index => index.host === host && index.importedIdentifier === requestedIdentifier);
  }

  /**
   *
   * @param host file name
   * @param requestedIdentifier component class name
   * The 'host' uses the 'tsName' component. The 'host' try to find 'tsName' component.
   */
  private findDependencyComponent(host: string, requestedIdentifier: string): TsIndex {
    const found = this.importIndexes.find(index => index.importedIdentifier === requestedIdentifier);
    const founds = this.importIndexes.filter(index => index.importedIdentifier === requestedIdentifier);
    // TODO, check if need
    // if (founds.length > 1) {
    //   console.log('duplication ==> ', founds);
    // }
    return found;

    // const hosts = this.importIndexes.filter(index => index.filename === host);
    // const hostName = hosts && hosts.length ? hosts[0].host : host;
    // return this.importIndexes
    //   .filter(index => index.host === hostName)
    //   .find(index => index.tsName === tsName);
  }

  private findVariableIndex(host: string, tsName: string): TsIndex {
    return this.variablesIndexes.find(index =>
      index.host === host && index.importedIdentifier === tsName);
  }
}

class TsIndex {
  host: string;                 // The file imports 'tsName'
  ponentType: TsPonentType;

  importedIdentifier: string;           // imported identifier
  importedFile?: string;        // imported filename
  value?: any;

  alterName?: string;

  constructor(
    public tsPonent: TsPonent
  ) {
    this.host = tsPonent.fileName;
    this.ponentType = tsPonent.ponentType;

    if (this.ponentType === TsPonentType.ImportPonent) {
      this.importedIdentifier = tsPonent.value[0];
      this.importedFile = tsPonent.getOption('relateFileName');
    } else {
      this.importedIdentifier = tsPonent.name;
      this.value = tsPonent._rawValue;
    }
  }
}
