import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../model/user';
import { Store } from '@ngrx/store';
import { AppState } from '../appState';

@Pipe({
  name: 'user'
})
export class UserPipe implements PipeTransform {

  private users: User[] =[];

  constructor(private store: Store<AppState>) {
    store.select('users').subscribe( res => {
      if(res){
        this.users = res;
      }
    });
  }
  
  transform(value: String, args?: any): User {
    return this.users.find(user => user.username ? user.username.toLowerCase() === value.toLowerCase(): false);
  }

}
