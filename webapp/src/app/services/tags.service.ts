import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable()
export class TagsService extends BaseService {

  constructor(private http: HttpClient, configService: ConfigService<any>) {
    super(configService);
  }

  public getAllTags() {
      const headers = this.createHeaders();
      const url = this.url + '/tags';
      return this.http.get(url, { headers: headers });
  }
}
