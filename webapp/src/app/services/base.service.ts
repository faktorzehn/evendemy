import { HttpHeaders } from '@angular/common/http';
import { ConfigService } from '@ngx-config/core';

export class BaseService {

  protected url = this.config.getSettings().backend_url;

  constructor(private config: ConfigService) {}

  protected createHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      Authorization: localStorage.getItem('token'),
      'Content-Type': 'application/json'
    });
    return headers;
  }
}
