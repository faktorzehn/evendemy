import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../model/user';
import { Store } from '@ngrx/store';
import { AppState } from '../appState';

@Pipe({
  name: 'name'
})
export class NamePipe implements PipeTransform {
  
  transform(value: User, args?: any): String {
    if(value && value.firstname && value.lastname){
      return value.firstname + ' ' +value.lastname;
    }
    return '';
  }

}
