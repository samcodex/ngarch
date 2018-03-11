export enum TsPonentType {
  ClassPonent = 'ClassPonent',
  PropertyPonent = 'PropertyPonent',
  ConstructorPonent = 'ConstructorPonent',
  MethodPonent = 'MethodPonent',
  FunctionPonent = 'FunctionPonent',
  ParameterPonent = 'ParameterPonent',
  ArgumentPonent = 'ArgumentPonent',
  ValuePonent = 'ValuePonent',
  DecoratorPonent = 'DecoratorPonent',
  VariablePonent = 'VariablePonent'
}

export enum TsBasicType {
  AnyKeyword = 'AnyKeyword',
  NumberKeyword = 'NumberKeyword',
  ObjectKeyword = 'ObjectKeyword',
  BooleanKeyword = 'BooleanKeyword',
  StringKeyword = 'StringKeyword',
  SymbolKeyword = 'SymbolKeyword',
  ThisKeyword = 'ThisKeyword',
  VoidKeyword = 'VoidKeyword',
  UndefinedKeyword = 'UndefinedKeyword',
  NullKeyword = 'NullKeyword',
  NeverKeyword = 'NeverKeyword',
  FunctionExpression = 'FunctionExpression'
}

export enum TsPonentModifier {
  AbstractKeyword = 'AbstractKeyword',
  AsyncKeyword = 'AsyncKeyword',
  ConstKeyword = 'ConstKeyword',
  DeclareKeyword = 'DeclareKeyword',
  DefaultKeyword = 'DefaultKeyword',
  ExportKeyword = 'ExportKeyword',
  PublicKeyword = 'PublicKeyword',
  PrivateKeyword = 'PrivateKeyword',
  ProtectedKeyword = 'ProtectedKeyword',
  ReadonlyKeyword = 'ReadonlyKeyword',
  StaticKeyword = 'StaticKeyword'
}

export enum tsPonentLiteral {
  StringLiteral = 'StringLiteral',
  NumericLiteral = 'NumericLiteral',
  TrueKeyword = 'TrueKeyword',
  FalseKeyword = 'FalseKeyword'
}

export interface IDataType {
  _dataType?: any;
}
