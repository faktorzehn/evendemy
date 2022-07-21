import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable()
export class ConfigService<T> {

    private _config: T;

    constructor(private http: HttpClient) {
    }

    public load() {
        var o = this.http.get<T>('./assets/config.json').pipe(first());
        o.subscribe((config: T) => this._config = config);
        return () => o;
    }

    public get config() {
        return this._config;
    }
}