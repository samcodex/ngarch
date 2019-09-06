export class ArrayObject<T> {
  private _array: T[] = [];
  private _object: {[key: string]: T} = {};
  // private _addition: {[key: string]: T};

  constructor() {}

  push(value: T, key?: string) {
    this._array.push(value);

    if (key && key !== '') {
      this._object[key] = value;
    }
  }

  get data(): T[] {
    return this._array;
  }

  get object(): {[key: string]: T} {
    return this._object;
  }

  get isComplete(): boolean {
    return this._array.length === Object.values(this._object).length;
  }

  getValueByKey(key: string): T {
    return this._object[key];
  }

  sort(callback) {
    this._array.sort(callback);
  }

  clear() {
    this._array.length = 0;
    this._object = {};
    // this._addition = null;
  }
}
