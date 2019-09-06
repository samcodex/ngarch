import { util } from '@util/util';

export interface Serializable {
  $clazz: string;
}

export interface Deserializable {
  $clazz: string;
}

export function instantiate(clazzConfig: {}) {
  const clazzKeys = Object.keys(clazzConfig);
  const clazzes = Object.values(clazzConfig);

  const instantiator = (obj: Object) => {
    const $clazz = obj['$clazz'];
    if ($clazz && clazzKeys.includes($clazz)) {
      const clazz = clazzConfig[$clazz];
      changePrototype(obj, clazz);
    }
  };

  return (data) => {
    traverseObject(instantiator, clazzes, data);
  };
}

function traverseObject(callback: Function, clazzes: any[], obj: any) {
  if (util.isObject(obj)) {
    if (!clazzes.some(clazz => obj instanceof clazz)) {
      callback.call(null, obj);

      Object.keys(obj).forEach(key => traverseObject(callback, clazzes, obj[key]));
    }

  } else if (Array.isArray(obj)) {
    obj
      .filter(item => item && util.isObject(item))
      .forEach(traverseObject.bind(null, callback, clazzes));
  }
}

interface JS {
  prototype: any;
}

function changePrototype<T extends JS>(obj: Object, clazz: JS ) {
  obj['__proto__'] = clazz.prototype;
}
