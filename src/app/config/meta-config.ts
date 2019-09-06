export enum MetaDataType {
  String = 'string',
  Number = 'number',
  Boolean = 'boolean'
}

export enum MetaInputType {
  CheckBox = 'CheckBox',
  InputField = 'InputField',
  Selection = 'Selection',
  RadioGroup = 'RadioGroup',
  RadioButton = 'RadioButton'
}

export const metaDataInitialValues: {[key: string]: any } = {
  [ MetaDataType.String ]: '',
  [ MetaDataType.Number ]:  '',
  [ MetaDataType.Boolean]: false
};
