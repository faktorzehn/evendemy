import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { ConfigService } from './config.service';
import { Settings } from '../model/settings';

@Injectable({
  providedIn: 'root'
})
export class SettingsService extends BaseService {

  constructor(private http: HttpClient, configService: ConfigService<any>) {
    super(configService);
  }

  public getSettings() {
    const headers = this.createHeaders();
    const url = this.url + '/settings';
    return this.http.get<Settings>(url, {headers: headers});
  }

  public updateSettings(options: {
    summary_of_meetings_visible: boolean
  }) {
    const headers = this.createHeaders();
    const url = this.url + '/settings';
    return this.http.put(url, options, {headers: headers});
  }

}
