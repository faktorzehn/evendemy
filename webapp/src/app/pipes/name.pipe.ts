import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../model/user';

@Pipe({
  name: 'name'
})
export class NamePipe implements PipeTransform {

  transform(value: User, args?: any): String {
    if (value && value.firstname && value.lastname) {
      return value.firstname + ' ' + value.lastname;
    }
    return '';
  }

}
