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

}
