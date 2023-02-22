import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { ConfigService } from './config.service';
import { User } from '../model/user';

@Injectable()
export class UserService extends BaseService {

  constructor(private http: HttpClient, configService: ConfigService<any>) {
    super(configService);
  }

  public getUserByUsername(username: string) {
      const headers = this.createHeaders();
      const url = this.url + '/user/' + username;
      return this.http.get<User>(url, { headers: headers });
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
