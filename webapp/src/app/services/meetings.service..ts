import { Injectable } from '@angular/core';
import { Meeting } from '../model/meeting';
import { Store } from '@ngrx/store';
import { AppState } from '../appState';
import 'rxjs/add/operator/do';
import { InitMeetings, AddMeeting, RemoveMeeting, UpdateMeeting } from '../actions/meetings.actions';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ConfigService } from '@ngx-config/core';
import { BaseService } from './base.service';

@Injectable()
export class MeetingsService extends BaseService {

    constructor(private http: HttpClient, private store: Store<AppState>, config: ConfigService) {
      super(config);
    }

    public getAllMeetings(options?: {
        username?: string;
        courseOrEvent?: string;
        isFreetime?: boolean;
        showNew?: boolean;
        showOld?: boolean;
        showNotAnnounced?: boolean;
    }) {
        const headers = this.createHeaders();
        const randomizedNumber = Math.floor(Math.random() * 10000);
        const url = this.url + '/meetings?r=' + randomizedNumber;
        let params: HttpParams = new HttpParams();
        if (options) {
            if (options.username !== undefined) {
                params = params.append('username', options.username);
            }
            if (options.courseOrEvent !== undefined) {
                params = params.append('courseOrEvent', options.courseOrEvent.toString());
            }
            if (options.isFreetime !== undefined) {
                params = params.append('isFreetime', options.isFreetime.toString());
            }
            if (options.showNew !== undefined) {
                params = params.append('showNew', options.showNew.toString());
            }
            if (options.showOld !== undefined) {
                params = params.append('showOld', options.showOld.toString());
            }
            if (options.showNotAnnounced !== undefined) {
                params = params.append('showNotAnnounced', options.showNotAnnounced.toString());
            }
        }
        this.http.get(url, { params: params, headers: headers }).subscribe((result: Meeting[]) => {
            this.store.dispatch(new InitMeetings(result));
        });
    }

    public getMyMeetings(username: string) {
      const headers = this.createHeaders();
      const url = this.url + '/meetings/attendee/' + username;

      return this.http.get(url, { headers: headers });
  }

  public getMeetingsFromAuthor(username: string) {
      const headers = this.createHeaders();
      const url = this.url + '/meetings/author/' + username;

      return this.http.get(url, { headers: headers });
  }
}
