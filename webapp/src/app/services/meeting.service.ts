import { first, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Meeting } from '../model/meeting';
import { Comment } from '../model/comment';
import { HttpClient, } from '@angular/common/http';
import { BaseService } from './base.service';
import { MeetingUser } from '../model/meeting_user';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable()
export class MeetingService extends BaseService {

    constructor(private http: HttpClient, configService: ConfigService<any>) {
      super(configService);
    }

    public createMeeting(meeting: Meeting) {
        const headers = this.createHeaders();
        const url = this.url + '/meeting';
        return this.http.post<Meeting>(url, meeting, { headers: headers });
    }

    public updateMeeting(meeting: Meeting) {
        const headers = this.createHeaders();
        if (meeting.mid === undefined) {
          console.error('updateMeeting: meeting id is not set');
        }
        const url = this.url + '/meeting/' + meeting.mid;
        return this.http.put(url, meeting, { headers: headers });
    }

    public deleteMeeting(mid: number) {
        const headers = this.createHeaders();
        const url = this.url + '/meeting/' + mid;
        return this.http.delete(url, { headers: headers });
    }

    public addComment(mid: number, comment: Comment) {
      const headers = this.createHeaders();
      const url = this.url + '/meeting/' + mid + '/comment';
      return this.http.post<Meeting>(url, comment, {headers: headers});
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
      return this.http.get<Meeting>(url, {headers: headers});
    }

    public attendMeeting(mid: number, username: String, external: String) {
      const headers = this.createHeaders();
      const external_array = external ? [external] :  [];
      if (mid === undefined || username === undefined) {
        console.error('attendMeeting: mid or username is empty');
        return;

      }
      const url = this.url + '/meeting/' + mid + '/attendee/' + username + '/attend';
      return this.http.put(url, {mid: mid, username: username, externals: external_array}, { headers: headers });
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

  public getAllAttendingUsers(mid: string) {
    const headers = this.createHeaders();
    const url = this.url + '/meeting/' + mid + '/attendees';

    return this.http.get<MeetingUser[]>(url, { headers: headers });
  }
}
