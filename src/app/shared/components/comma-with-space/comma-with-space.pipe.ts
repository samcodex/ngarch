import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'commaWithSpace'
})
export class CommaWithSpacePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    // return value;

    if (value) {
        if (typeof value === 'string') {
        return value.split(',').join(', ');
      } else if (typeof value === 'object') {
        const arr = Object.values(value);
        return value[0] ? arr.join(', ') : value;
      }
    }

    return value;
  }

}
