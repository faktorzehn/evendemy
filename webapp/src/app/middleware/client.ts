import { Injectable } from '@angular/core';
import { Http, Headers, Request, Response, URLSearchParams } from '@angular/http';
import { User } from '../model/user';
import { Meeting } from '../model/meeting';
import { MeetingUser } from '../model/meeting_user';
import { Comment } from '../model/comment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Store } from '@ngrx/store';
import { AppState } from '../appState';
import { InitMeetings, AddMeeting } from '../actions/meetings.actions';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '@ngx-config/core';


@Injectable()
export class Client {
    private url = this.config.getSettings().backend_url;

    constructor(private http: HttpClient, private config: ConfigService, private store: Store<AppState>) {
    }

    private createHeaders(): HttpHeaders {
        const headers = new HttpHeaders({
            'Authorization': localStorage.getItem('token'),
            'Content-Type': 'application/json'
        });
        return headers;
    }

    public ping() {
        const headers = this.createHeaders();
        const url = this.url + '/ping';
        return this.http.get(url, { headers: headers });
    }

    public getMeetingByMId(mid: number) {
        const headers = this.createHeaders();
        const url = this.url + '/meeting/' + mid;
        return this.http.get(url, { headers: headers });
    }

    public getUserByUsername(username: string) {
        const headers = this.createHeaders();
        const url = this.url + '/user/' + username;
        return this.http.get(url, { headers: headers });
    }

    public getAllAttendingUsers(mid: string): Observable<MeetingUser[]> {
        const headers = this.createHeaders();
        const url = this.url + '/meeting/' + mid + '/attendees';

        return this.http.get(url, { headers: headers }) as Observable<MeetingUser[]>;
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

    public attendMeeting(mid: number, username: String, external: String) {
        const headers = this.createHeaders();
        const external_array = external ? [external] :  [];
        if (mid !== undefined && username !== undefined) {
            const url = this.url + '/meeting/' + mid + '/attendee/' + username + '/attend';
            return this.http.put(url, {mid: mid, username: username, externals: external_array}, { headers: headers });
        }
        return null;
    }

    public rejectAttendingMeeting(mid: number, username: String) {
        const headers = this.createHeaders();
        if (mid !== undefined && username !== undefined) {
            const url = this.url + '/meeting/' + mid + '/attendee/' + username + '/attend';
            return this.http.delete(url, { headers: headers });
        }
        return null;
    }

    public confirmAttendeeToMeeting(mid: number, username: String) {
        const headers = this.createHeaders();
        if (mid !== undefined && username !== undefined) {
            const url = this.url + '/meeting/' + mid + '/attendee/' + username + '/confirm';
            return this.http.put(url, {}, { headers: headers });
        }
        return null;
    }

}
