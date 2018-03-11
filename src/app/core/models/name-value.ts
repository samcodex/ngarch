export class NameValue {
  name: string;
  value: any;
  options?: any;

  constructor(name: string, value: any, options?: any) {
    this.name = name;
    this.value = value;
    this.options = options;
  }
}
