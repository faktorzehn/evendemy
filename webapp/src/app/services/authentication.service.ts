import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ConfigService } from './config.service';

@Injectable()
export class AuthenticationService {
  private url = this.configService.config.backend_url;

  constructor(
    private http: HttpClient,
    private configService: ConfigService<any>
  ) {}

  public loginUser(username: string, password: string) {
    const token = 'Basic ' + window.btoa(username + ':' + password);
    const headers = new HttpHeaders({
      Authorization: token,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:8080'
    });
    const url = this.url + '/auth';
    return this.http.post(url, {}, { headers: headers }).pipe(map(res => {
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      return res;
    }));
  }

  public logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  }

  public isLoggedIn() {
    return (
      localStorage.getItem('token') !== undefined &&
      localStorage.getItem('token') !== null
    );
  }

  public getLoggedInUsername() {
    return localStorage.getItem('username')?.toLowerCase();
  }

}
