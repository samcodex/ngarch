import { ArchNgPonent } from '@core/arch-ngponent';
import { NgPonent, NgPonentType, Ponent, TsPonent, TsPonentType } from '@core/ngponent-tsponent';
import { ArchNgPonentClassMapping } from '@core/arch-ngponent/arch-ngponent-config';

const archClassKeys = Object.keys(ArchNgPonentClassMapping);
const specificNgPonentsType = [ NgPonentType.ModuleWithProviders, NgPonentType.Routes];
const tsPonentFilter = (ponent: TsPonent | NgPonent) => ponent.$clazz === 'TsPonent'
  || ponent.$clazz === 'NgPonent' && specificNgPonentsType.includes((<NgPonent>ponent).ponentType);


export class PonentGrouper {
  name: string;
  fileName: string;
  ngPonent: NgPonent;
  tsPonent: TsPonent;
  ponentType: NgPonentType | TsPonentType;

  constructor(name, fileName, ngPonent = null, tsPonent = null, ponentType = null) {
    this.name = name;
    this.fileName = fileName;
    this.ngPonent = ngPonent;
    this.tsPonent = tsPonent;
    this.ponentType = ponentType;
  }

  convertToArchNgPonent(excludePonentTypes: Array<TsPonentType | NgPonentType>): ArchNgPonent {
    let archPonent: ArchNgPonent = null;

    if (archClassKeys.indexOf(this.ponentType) > -1) {
      const clazz = ArchNgPonentClassMapping[this.ponentType];
      archPonent = new clazz(this.name, this.ngPonent, this.tsPonent);
      archPonent.setNgFeatures();
    } else {
      if (!excludePonentTypes.includes(<any>this.ponentType)) {
        console.warn(`Unimplemented ponent type - ${this.ponentType} - ${this.name} - ${this.fileName}`, this.tsPonent);
      }
    }

    return archPonent;
  }
}

export function groupPonents(ponents: Ponent[]): PonentGrouper[] {
  const twoTypePonents = ponents.filter(tsPonentFilter) as Array<TsPonent | NgPonent>;
  const ngPonents = ponents.filter(ponent => ponent.$clazz === 'NgPonent') as NgPonent[];

  const groupers: PonentGrouper[] = twoTypePonents.map(onePonent => {
    const { name: ponentName, fileName, ponentType } = onePonent;
    let ngPonent: NgPonent = null,
      tsPonent: TsPonent = null;

    if (onePonent instanceof TsPonent) {
      tsPonent = onePonent;
      if (<TsPonentType>ponentType !== TsPonentType.ImportPonent) {
        ngPonent = ngPonents.find(ngElement => ngElement.name === ponentName && ngElement.fileName === fileName);
      }
    } else {
      ngPonent = onePonent;
    }

    const ngPonentType = ngPonent ? ngPonent.ponentType : ponentType;
    const grouper = new PonentGrouper(ponentName, fileName, ngPonent, tsPonent, ngPonentType);

    return grouper;
  });

  return groupers;
}
