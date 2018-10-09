import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '@ngx-config/core';

@Injectable()
export class TagsService extends BaseService {

  constructor(private http: HttpClient, config: ConfigService) {
    super(config);
  }

  public getAllTags() {
      const headers = this.createHeaders();
      const url = this.url + '/tags';
      return this.http.get(url, { headers: headers });
  }
}
