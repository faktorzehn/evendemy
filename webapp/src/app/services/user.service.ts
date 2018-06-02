import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '@ngx-config/core';

@Injectable()
export class UserService {

  private url = this.config.getSettings().backend_url;

  constructor(private http: HttpClient, private config: ConfigService) {
  }

  private createHeaders(): HttpHeaders {
      const headers = new HttpHeaders({
          'Authorization': localStorage.getItem('token'),
          'Content-Type': 'application/json'
      });
      return headers;
  }

  public addImage(username: string, data: any) {
    const headers = this.createHeaders();
    const url = this.url + '/user/' + username + '/image';
    return this.http.post(url, data, {headers: headers});
  }

  public deleteImage(username: string) {
    const headers = this.createHeaders();
    const url = this.url + '/user/' + username + '/image';
    return this.http.delete(url, {headers: headers});
  }

  public updateSettings(username: string, options: {
    additional_info_visible: boolean,
    summary_of_meetings_visible: boolean
  }) {
    const headers = this.createHeaders();
    const url = this.url + '/user/' + username + '/settings';
    return this.http.put(url, options, {headers: headers});
  }

  public updateAdditionalInfo(username: string, options: any) {
    const headers = this.createHeaders();
    const url = this.url + '/user/' + username + '/additional_info';
    return this.http.put(url, options, {headers: headers});
  }


}
