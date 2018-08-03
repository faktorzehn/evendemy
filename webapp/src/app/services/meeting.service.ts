import { Injectable } from '@angular/core';
import { Meeting } from '../model/meeting';
import { Comment } from '../model/comment';
import { Store } from '@ngrx/store';
import { AppState } from '../appState';
import 'rxjs/add/operator/do';
import { InitMeetings, AddMeeting, RemoveMeeting, UpdateMeeting } from '../actions/meetings.actions';
import { SelectMeeting, UnselectMeeting, UpdateComments } from '../actions/selectMeeting.actions';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ConfigService } from '@ngx-config/core';

@Injectable()
export class MeetingService {
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

    public createMeeting(meeting: Meeting) {
        const headers = this.createHeaders();
        const url = this.url + '/meeting';
        return this.http.post(url, meeting, { headers: headers }).do((result: Meeting) => {
            this.store.dispatch(new AddMeeting(result));
        });
    }

    public updateMeeting(meeting: Meeting) {
        const headers = this.createHeaders();
        if (meeting.mid !== undefined) {
            const url = this.url + '/meeting/' + meeting.mid;
            return this.http.put(url, meeting, { headers: headers }).
                do(res => this.store.dispatch(new UpdateMeeting(meeting)));
        }
        return null;
    }

    public deleteMeeting(mid: number) {
        const headers = this.createHeaders();
        const url = this.url + '/meeting/' + mid;
        return this.http.delete(url, { headers: headers }).
            do(res => this.store.dispatch(new RemoveMeeting(mid)));
    }

    public addComment(mid: number, comment: Comment) {
      const headers = this.createHeaders();
      const url = this.url + '/meeting/' + mid + '/comment';
      return this.http.post(url, comment, {headers: headers}).
        do( (res: any) => {
          this.store.dispatch(new UpdateComments({mid: mid, comments: res.comments}));
        });
    }

    public getCalendar(mid: number) {
        const headers = this.createHeaders();
        const url = this.url + '/meeting/' + mid + '/calendar';
        return this.http.get(url, {headers: headers});
    }

    public addImage(mid: number, data: any) {
      const headers = this.createHeaders();
      const url = this.url + '/meeting/' + mid + '/image';
      return this.http.post(url, data, {headers: headers});
    }

    public loadMeeting(mid: number) {
      const headers = this.createHeaders();
      const url = this.url + '/meeting/' + mid;
      return this.http.get(url, {headers: headers}).do( (res: Meeting) => {
        this.selectMeeting(res);
      });
    }

    public selectMeeting(meeting: Meeting) {
        this.store.dispatch(new SelectMeeting(meeting));
    }

    public unloadMeeting() {
        this.store.dispatch(new UnselectMeeting());
    }
}
