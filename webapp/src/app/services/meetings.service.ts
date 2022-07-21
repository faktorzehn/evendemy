import { Injectable } from '@angular/core';
import { Meeting } from '../model/meeting';
import { Store } from '@ngrx/store';
import { AppState } from '../appState';
import { InitMeetings} from '../actions/meetings.actions';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { MeetingUser } from '../model/meeting_user';
import { ConfigService } from './config.service';

@Injectable()
export class MeetingsService extends BaseService {

    constructor(private http: HttpClient, private store: Store<AppState>, configService: ConfigService<any>) {
      super(configService);
    }

    public getAllMeetings(options?: {
        username?: string;
        type?: string;
        idea: boolean,
        isFreetime?: boolean;
        showNew?: boolean;
        showOld?: boolean;
        showNotAnnounced?: boolean;
        tags?: string[];
    }) {
        const headers = this.createHeaders();
        const randomizedNumber = Math.floor(Math.random() * 10000);
        const url = this.url + '/meetings?r=' + randomizedNumber;
        let params: HttpParams = new HttpParams();
        if (options) {
            if (options.username !== undefined) {
                params = params.append('username', options.username);
            }
            if (options.type !== undefined) {
                params = params.append('type', options.type.toString());
            }
            if (options.idea !== undefined) {
              params = params.append('idea', options.idea.toString());
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
            if (options.tags !== undefined && options.tags.length > 0 ) {
              params = params.append('tags', options.tags.toString());
            }
        }
        this.http.get(url, { params: params, headers: headers }).subscribe((result: Meeting[]) => {
            this.store.dispatch(new InitMeetings(result));
        });
    }

  public getMyConfirmedMeetings(username: string): Observable<MeetingUser[]> {
      const headers = this.createHeaders();
      const url = this.url + '/meetings/attending/confirmed/' + username;

      return this.http.get(url, { headers: headers }) as Observable<MeetingUser[]>;
  }

  public getMyAttendingMeetings(username: string): Observable<MeetingUser[]> {
    const headers = this.createHeaders();
    const url = this.url + '/meetings/attending/' + username;

    return this.http.get(url, { headers: headers }) as Observable<MeetingUser[]>;
  }

  public getMeetingsFromAuthor(username: string): Observable<Meeting[]> {
      const headers = this.createHeaders();
      const url = this.url + '/meetings/author/' + username;

      return this.http.get(url, { headers: headers }) as Observable<Meeting[]>;
  }
}
