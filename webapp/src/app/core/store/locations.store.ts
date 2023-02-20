import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, first, Observable } from 'rxjs';
import { Location } from '../../model/location';
import { User } from '../../model/user';
import { ConfigService } from '../../services/config.service';

/**
 * User Store that caches the users as observable.
 */
@Injectable({
  providedIn: 'root'
})
export class LocationsStore {

  private subject: BehaviorSubject<Location[]|undefined> = new BehaviorSubject(undefined);

  protected url = this.configService.config.backend_url;

  constructor(private configService: ConfigService<any>, private http: HttpClient) {
  }

  public locations(): Observable<Location[]> {
    if(this.subject.getValue() === undefined) {
      this.load().pipe(first()).subscribe( locations => this.subject.next(locations));
    }

    return this.subject;
  }

  private load() {
    return this.http.get<Location[]>(`${this.url}/locations`);
  }
}
