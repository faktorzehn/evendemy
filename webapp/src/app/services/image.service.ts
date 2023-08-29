import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable()
export class ImageService extends BaseService {

  constructor(private http: HttpClient, configService: ConfigService<any>) {
    super(configService);
  }

  public getImageForMeeting(mid: number){
    return this.http.get(`${this.url}/meeting/${mid}/image`);
  }
  
  public getImageForUser(uid:string){
    return this.http.get(`${this.url}/user/${uid}/image`);
  }
}

