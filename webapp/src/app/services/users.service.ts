import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../appState';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ConfigService } from '@ngx-config/core';
import { User } from '../model/user';
import { InitUsers } from '../actions/users.actions';
import 'rxjs/add/operator/retry';
import { BaseService } from './base.service';

@Injectable()
export class UsersService extends BaseService {

    constructor(private http: HttpClient, private store: Store<AppState>, config: ConfigService) {
      super(config);
    }

    public loadAllUsers() {
      const headers = this.createHeaders();
      const url = this.url + '/users';
      return this.http.get(url, {headers: headers}).retry(5).do( (res: User[]) => {
        this.setUsers(res);
      });
    }

    public setUsers(users: User[]) {
        this.store.dispatch(new InitUsers(users));
    }

}
