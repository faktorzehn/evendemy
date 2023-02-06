import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, first, Observable } from 'rxjs';
import { User } from '../../model/user';
import { ConfigService } from '../../services/config.service';

/**
 * User Store that caches the users as observable.
 */
@Injectable({
  providedIn: 'root'
})
export class UsersStore {

  private subject: BehaviorSubject<User[]|undefined> = new BehaviorSubject(undefined);

  protected url = this.configService.config.backend_url;

  constructor(private configService: ConfigService<any>, private http: HttpClient) { 
  }

  public users(): Observable<User[]> {
    if(this.subject.getValue() === undefined) {
      this.load().pipe(first()).subscribe( users => this.subject.next(users));
    }

    return this.subject;
  }

  private load() {
    return this.http.get<User[]>(`${this.url}/users`);
  }
}
