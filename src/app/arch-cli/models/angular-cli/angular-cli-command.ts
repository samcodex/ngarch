import { AngularCliCommandType, AngularCliOperandTemplate } from './angular-cli-definition';
import { MetaDataType, MetaInputType, metaDataInitialValues } from '../../../config';

export class AngularCliCommand {
  command: AngularCliCommandType;
  commandAlias?: string;

  template?: AngularCliOperandTemplate;
  operand?: CliOperandPart;
  options?: CliOptionPart[];
  versions?: string[];

  description?: string;
  details?: string[];
  allowExecute?: boolean;

  static fromData(data: AngularCliCommand): AngularCliCommand {
    const instance = new AngularCliCommand(data.command, data.template);
    instance.operand = data.operand ? CliOperandPart.fromData(data.operand) : null;
    instance.options = data.options ? data.options.map(option => CliOptionPart.fromData(option)) : null;
    instance.versions = data.versions;
    instance.description = data.description;
    instance.details = data.details;
    instance.commandAlias = data.commandAlias;
    instance.allowExecute = data.allowExecute;

    return instance;
  }

  constructor(command: AngularCliCommandType, template: AngularCliOperandTemplate) {
    this.command = command;
    this.template = template;
  }

  getCommandLine(): string {
    const command = this.getCommandPart();
    const operand = this.getOperandPart();
    const options = this.getOptionsPart();

    return this.getCommandPart() + (operand ? ' ' + operand : '') + (options ? ' ' + options : '');
  }

  getCommandPart(): string {
    let part;
    if (this.commandAlias) {
      part = this.commandAlias;
    } else {
      part = this.command;
      if (this.template) {
        part += ` ${this.template}`;
      }
    }

    return 'ng ' + part;
  }

  getOptionsPart(): string {
    return this.options
      ? this.options.reduce((result: string, optionPart) => {
        const part = optionPart.getOptionPart();

        return result + (part ? ` --${part}` : '');
      }, '')
      : null;
  }

  getOperandPart(): string {
    return this.operand ? this.operand.getOperandPart() : null;
  }
}

export class CliOperandPart {
  name: string;
  module?: string;
  path?: string;
  description?: string;
  details?: string[];

  static fromData(operand: CliOperandPart): CliOperandPart {
    const name = operand ? operand.name : null;
    const instance = new CliOperandPart(name);
    Object.assign(instance, operand);

    return instance;
  }

  constructor(name: string) {
    this.name = name;
  }

  getOperandPart(): string {
    return this.name ? this.name : '';
  }
}

export class CliOptionPart {
  option: string;
  alias?: string;
  description?: string;
  details?: string[];
  optionValue?: CliOptionValue;
  disabled?: boolean;
  isUsed?: boolean;
  allowNoneValue?: boolean;

  static fromData(option: CliOptionPart): CliOptionPart {
    const instance = new CliOptionPart();
    Object.assign(instance, option);
    instance.optionValue = CliOptionValue.fromData(option.optionValue);

    return instance;
  }

  constructor() {
    this.isUsed = false;
  }

  getOptionPart(): string {
    let param = null;
    if (this.isUsed) {
      const { option } = this;
      const value = this.optionValue.getOptionValue();
      const isNoneValue = value === '';
      const noneValue = () => this.allowNoneValue ? option : null;
      param = isNoneValue ? noneValue() : `${option}=${value}`;
    }

    return param;
  }

  setOptionInitialValue() {
    this.optionValue.setInitialValue();
  }
}

export class CliOptionValue {
  defaultValue?: string | boolean | number;
  dataType?: MetaDataType;
  possibleValues?: string[];

  inputType?: MetaInputType;
  inputValue?: any;

  static fromData(optValue: CliOptionValue): CliOptionValue {
    const instance = new CliOptionValue();
    Object.assign(instance, optValue);

    instance.setInputType();
    instance.setInitialValue();

    return instance;
  }

  constructor() {
  }

  setInputType() {
    const { dataType, possibleValues } = this;

    if (dataType) {
      if (dataType === MetaDataType.Boolean) {
        this.inputType = MetaInputType.CheckBox;
      } else if (dataType === MetaDataType.Number || dataType === MetaDataType.String) {
        if (possibleValues && possibleValues.length) {
          this.inputType = MetaInputType.Selection;
        } else {
          this.inputType = MetaInputType.InputField;
        }
      }
    }
  }

  setInitialValue() {
    return this.inputValue = metaDataInitialValues[this.dataType];
  }

  getOptionValue(): string {
    return this.inputValue;
  }
}
