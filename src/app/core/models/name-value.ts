export class NameValue<T = string, S = null> {
  name: string;
  value: T;
  options?: S;

  constructor(name: string, value: T, options?: S) {
    this.name = name;
    this.value = value;
    this.options = options;
  }
}
