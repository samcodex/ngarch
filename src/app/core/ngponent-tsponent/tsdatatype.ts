import { Deserializable } from './../serialization';
import { IDataType, TsBasicType } from './tsponent-definition';
import { util } from './../util';

const jsonProperties = ['_dataType', 'originType', 'isArrayTypeNode'];

export class TsDataType implements IDataType, Deserializable {
  $clazz = 'TsDataType';

  _dataType: TsBasicType | string;
  originType: string;

  isArrayTypeNode?: boolean;
  tsDataType?: TsDataType | TsDataType[];

  constructor() {

  }

  fromJson(data: object) {
    util.copyProperty(this, data, jsonProperties);

    if ('tsDataType' in data) {
      const tsDtType = data['tsDataType'];

      if (Array.isArray(tsDtType)) {
        this.tsDataType = tsDtType.map((type) => {
          const tsType = new TsDataType();
          tsType.fromJson(type);
          return tsType;
        });

        // const tsDataType = this.tsDataType = new Array<TsDataType>();
        // tsDtType.forEach(type => {
        //   const tsType = new TsDataType();
        //   tsType.fromJson(type);
        //   tsDataType.push(tsType);
        // });
      } else {
        this.tsDataType = new TsDataType();
        this.tsDataType.fromJson(tsDtType);
      }
    }
  }
}
