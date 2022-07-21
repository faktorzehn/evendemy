import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../appState';
import { HttpClient } from '@angular/common/http';
import { User } from '../model/user';
import { InitUsers } from '../actions/users.actions';
import { BaseService } from './base.service';
import { retry, first, tap} from 'rxjs/operators';
import { ConfigService } from './config.service';

@Injectable()
export class UsersService extends BaseService {

    constructor(private http: HttpClient, private store: Store<AppState>, configService: ConfigService<any>) {
      super(configService);
    }

    public loadAllUsers() {
      const headers = this.createHeaders();
      const url = this.url + '/users';
      return this.http.get(url, {headers: headers}).pipe(retry(3), first(), tap( (res: User[]) => {
        this.setUsers(res);
      }));
    }

    public setUsers(users: User[]) {
        this.store.dispatch(new InitUsers(users));
    }

}
