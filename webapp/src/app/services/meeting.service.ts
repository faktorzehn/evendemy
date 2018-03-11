import { Injectable } from '@angular/core';
import { Http, Headers, Request, Response, URLSearchParams } from '@angular/http';
import { Meeting } from './../model/meeting';
import { Comment } from './../model/comment';
import { ConfigService } from 'ng2-config';
import { Store } from '@ngrx/store';
import { AppState } from '../appState';
import { InitMeetings, AddMeeting, RemoveMeeting, UpdateMeeting } from '../actions/meetings.actions';
import { SelectMeeting, UnselectMeeting, UpdateComments } from '../actions/selectMeeting.actions';

@Injectable()
export class MeetingService {
    private url = this.config.getSettings().backend_url;

    constructor(private http: Http, private config: ConfigService, private store: Store<AppState>) { }

    private createHeaders(): Headers {
        const headers = new Headers();
        headers.append('Authorization', localStorage.getItem('token'));
        headers.append('Content-Type', 'application/json');
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
        const params: URLSearchParams = new URLSearchParams();
        if (options) {
            if (options.username !== undefined) {
                params.set('username', options.username);
            }
            if (options.courseOrEvent !== undefined) {
                params.set('courseOrEvent', options.courseOrEvent.toString());
            }
            if (options.isFreetime !== undefined) {
                params.set('isFreetime', options.isFreetime.toString());
            }
            if (options.showNew !== undefined) {
                params.set('showNew', options.showNew.toString());
            }
            if (options.showOld !== undefined) {
                params.set('showOld', options.showOld.toString());
            }
            if (options.showNotAnnounced !== undefined) {
                params.set('showNotAnnounced', options.showNotAnnounced.toString());
            }
        }
        this.http.get(url, { search: params, headers: headers }).map(res => res.json()).subscribe(result => {
            this.store.dispatch(new InitMeetings(result));
        });
    }

    public createMeeting(meeting: Meeting) {
        const headers = this.createHeaders();
        const url = this.url + '/meeting';
        return this.http.post(url, meeting, { headers: headers }).map(res => res.json()).do(result => {
            this.store.dispatch(new AddMeeting(result));
        });
    }

    public updateMeeting(meeting: Meeting) {
        const headers = this.createHeaders();
        if (meeting.mid !== undefined) {
            const url = this.url + '/meeting/' + meeting.mid;
            return this.http.put(url, meeting, { headers: headers }).
                do(res => this.store.dispatch(new UpdateMeeting(meeting))).
                map(res => res.json());
        }
        return null;
    }

    public deleteMeeting(mid: number) {
        const headers = this.createHeaders();
        const url = this.url + '/meeting/' + mid;
        return this.http.delete(url, { headers: headers }).
            do(res => this.store.dispatch(new RemoveMeeting(mid))).
            map(res => res.json());
    }

    public addComment(mid: number, comment: Comment) {
      const headers = this.createHeaders();
      const url = this.url + '/meeting/' + mid + '/comment';
      return this.http.post(url, comment, {headers: headers}).
        map(res => res.json()).
        do( (res: any) => {
          this.store.dispatch(new UpdateComments({mid: mid, comments: res.comments}))
        });
    }

    public addImage(mid: number, data: any) {
      const headers = this.createHeaders();
      const url = this.url + '/meeting/' + mid + '/image';
      return this.http.post(url, data, {headers: headers}).map(res => res.json());
    }

    public loadMeeting(mid: number) {
      const headers = this.createHeaders();
      const url = this.url + '/meeting/' + mid;
      return this.http.get(url, {headers: headers}).map(res => res.json()).do( res => {
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
