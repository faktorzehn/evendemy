import { first, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Meeting } from '../model/meeting';
import { Comment } from '../model/comment';
import { Store } from '@ngrx/store';
import { AppState } from '../appState';
import { AddMeeting, RemoveMeeting, UpdateMeeting } from '../actions/meetings.actions';
import { SelectMeeting, UnselectMeeting, UpdateComments } from '../actions/selectMeeting.actions';
import { HttpClient, } from '@angular/common/http';
import { BaseService } from './base.service';
import { MeetingUser } from '../model/meeting_user';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable()
export class MeetingService extends BaseService {

    constructor(private http: HttpClient, private store: Store<AppState>, configService: ConfigService<any>) {
      super(configService);
    }

    public createMeeting(meeting: Meeting) {
        const headers = this.createHeaders();
        const url = this.url + '/meeting';
        return this.http.post(url, meeting, { headers: headers }).pipe(tap((result: Meeting) => {
            this.store.dispatch(new AddMeeting(result));
        }), first());
    }

    public updateMeeting(meeting: Meeting) {
        const headers = this.createHeaders();
        if (meeting.mid !== undefined) {
            const url = this.url + '/meeting/' + meeting.mid;
            return this.http.put(url, meeting, { headers: headers }).pipe(tap(res => this.store.dispatch(new UpdateMeeting(meeting))), first());
        }
        return null;
    }

    public deleteMeeting(mid: number) {
        const headers = this.createHeaders();
        const url = this.url + '/meeting/' + mid;
        return this.http.delete(url, { headers: headers }).pipe(tap(res => this.store.dispatch(new RemoveMeeting(mid)), first()));
    }

    public addComment(mid: number, comment: Comment) {
      const headers = this.createHeaders();
      const url = this.url + '/meeting/' + mid + '/comment';
      return this.http.post(url, comment, {headers: headers}).pipe(tap( (res: any) => {
          this.store.dispatch(new UpdateComments({mid: mid, comments: res.comments}));
        }), first());
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

    public getMeeting(mid: number) {
      const headers = this.createHeaders();
      const url = this.url + '/meeting/' + mid;
      return this.http.get(url, {headers: headers});
    }

    public getMeetingAndSelect(mid: number) {
      return this.getMeeting(mid).pipe(tap((res: Meeting) => {
        this.selectMeeting(res);
      }), first());
    }

    public selectMeeting(meeting: Meeting) {
        this.store.dispatch(new SelectMeeting(meeting));
    }

    public unloadMeeting() {
        this.store.dispatch(new UnselectMeeting());
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

  public getAllAttendingUsers(mid: string): Observable<MeetingUser[]> {
    const headers = this.createHeaders();
    const url = this.url + '/meeting/' + mid + '/attendees';

    return this.http.get(url, { headers: headers }) as Observable<MeetingUser[]>;
  }
}
