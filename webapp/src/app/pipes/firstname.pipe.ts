import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../model/user';
import { Store } from '@ngrx/store';
import { AppState } from '../appState';

@Pipe({
  name: 'firstname'
})
export class FirstnamePipe implements PipeTransform {
  
  transform(value: User, args?: any): String {
    if(value){
      return value.firstname;
    }
    return '';
  }

}
