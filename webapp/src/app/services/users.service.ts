import { Injectable } from '@angular/core';
import { Meeting } from './../model/meeting';
import { Comment } from './../model/comment';
import { Store } from '@ngrx/store';
import { AppState } from '../appState';
import { InitMeetings, AddMeeting, RemoveMeeting, UpdateMeeting } from '../actions/meetings.actions';
import { SelectMeeting, UnselectMeeting, UpdateComments } from '../actions/selectMeeting.actions';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ConfigService } from '@ngx-config/core';
import { User } from '../model/user';
import { InitUsers } from '../actions/users.actions';

@Injectable()
export class UsersService {
    private url = this.config.getSettings().backend_url;

    constructor(private http: HttpClient, private store: Store<AppState>, private config: ConfigService) { 
    }

    private createHeaders(): HttpHeaders {
        const headers = new HttpHeaders({
            'Authorization': localStorage.getItem('token'),
            'Content-Type': 'application/json'
        });
        return headers;
    }

    public loadAllUsers() {
      const headers = this.createHeaders();
      const url = this.url + '/users';
      return this.http.get(url, {headers: headers}).retry(5).do( (res : User[]) => {
        this.setUsers(res);
      });
    }

    public setUsers(users: User[]) {
        this.store.dispatch(new InitUsers(users));
    }

}
