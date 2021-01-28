import { Deserializable } from '../serialization';
import { IDataType, TsBasicType } from './tsponent-definition';

export class TsDataType implements IDataType, Deserializable {
  $clazz = 'TsDataType';

  _dataType: TsBasicType | string;
  originType: string;

  isArrayTypeNode?: boolean;
  tsDataType?: TsDataType | TsDataType[];

  constructor() {}
}
