import { forOwn } from 'lodash-es';

export namespace util {
  export function copyProperty(desc: object, src: object, properties: string[]) {
    properties.forEach(p => {
      if (p in src) {
        const val = src[p];
        const typ = typeof val;

        if (Array.isArray(val)) {
          desc[p] = val.map(d => d);
        } else if (['string', 'number', 'boolean'].indexOf(typ) > -1) {
          desc[p] = val;
        } else {
          console.log('Unimplemented copyProperty - ', p , ' = ', val);
        }
      }
    });
  }

  export function getHashCode(text) {
    let hash = 0, i, chr;
    if (text.length === 0) {
      return hash;
    }

    for (i = 0; i < text.length; i++) {
      chr   = text.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  export function isObject(data: any): boolean {
    return data instanceof Object && !Array.isArray(data);
  }

  export const isArray = Array.isArray;

  export function assignMultipleDefaultValues(defaultValues: {[ key: string ]: any}) {
    return function(obj: {}) {
      forOwn(defaultValues, (defValue, property) => {
        assignDefaultValue(obj, property, defValue);
      });
    };
  }

  export function assignDefaultValue(obj: {}, property: string, defValue: any) {
    if (!obj.hasOwnProperty(property)) {
      obj[property] = defValue;
    }
  }

  export function calcObject(obj) {
    let sum = 0;
    forOwn(obj, (val) => sum += val);
    return sum;
  }

  export const isDirectory = _isDirectory;
  export const toFolderPath = _toFolderPath;
  export const applyCallback = _applyCallback;
  export const isDeepEqual = _isDeepEqual;
  export const resolvePaths = _resolvePaths;
  export const clearObject = _clearObject;
}

const extensions = ['html', 'ts', 'scss', 'htm', 'css'];
function _isDirectory(file: string): boolean {
  const ext = file.split('.').pop();
  return extensions.indexOf(ext) === -1;
}

function _toFolderPath(path: string) {
  const lastChar = path.substr(path.length - 1);
  return (lastChar === '/') ? path : path + '/';
}

/**
 *
 * @param fn
 * @param canBreak
 * @param rest
 * @returns boolean true - continue looping, false - break looping
 */
function _applyCallback(fn: Function, canBreak: boolean = false, ...rest: any[]): boolean {
  if (fn) {
    const returned = fn.apply(null, rest);
    return canBreak ? !!returned : true;
  } else {
    return true;      // no callback, then do nothing and keep the looping
  }
}

function _isDeepEqual(value1: any, value2: any) {
  if (value1 === value2) {
    return true;
  }
  if (value1 instanceof Date && value2 instanceof Date) {
    return value1.getTime() === value2.getTime();
  }
  if (!value1 || !value2 || (typeof value1 !== 'object' && typeof value2 !== 'object')) {
    return value1 === value2;
  }
  if (value1 === null || value1 === undefined || value2 === null || value2 === undefined) {
    return false;
  }
  if (value1.prototype !== value2.prototype) {
    return false;
  }
  if (Array.isArray(value1) && !Array.isArray(value2)
      || !Array.isArray(value1) && Array.isArray(value2)) {
    return false;
  }

  const keys = Object.keys(value1);
  if (keys.length !== Object.keys(value2).length) {
    return false;
  }

  return keys.every(k => _isDeepEqual(value1[k], value2[k]));
}

const separate = '/';
function stringElement(...elements: any[]): string[] {
  const result = [];
  elements.forEach((element: any) => {
    if (typeof element === 'string') {
      result.push.apply(result, element.split(separate));
    } else if (Array.isArray(element)) {
      result.push.apply(result, stringElement(...element));
    }
  });

  return result;
}

function _resolvePaths(...paths: any[]): string {
  const finalPaths = [];
  const formatedPaths = stringElement(paths);

  formatedPaths.forEach(path => {
    if (path === '.') {

    } else if (path === '..') {
      finalPaths.pop();
    } else {
      finalPaths.push(path);
    }
  });

  return finalPaths.join(separate);
}

function _clearObject(obj: object) {
  Object.getOwnPropertyNames(obj).forEach(function (prop) {
    delete obj[prop];
  });
}
