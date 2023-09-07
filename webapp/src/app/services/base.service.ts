import { HttpHeaders } from '@angular/common/http';
import { ConfigService } from './config.service';

export class BaseService {

  protected url = this.configService.config.backend_url;

  constructor(private configService: ConfigService<any>) {}

  protected createHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return headers;
  }
}
