import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { first } from "rxjs/operators";
import { APP_CONFIG } from "../../injection-tokens";

@Injectable()
export class ConfigService<T> {
  private _config: T;

  constructor(@Inject(APP_CONFIG) private readonly appConfig: any) {
    this._config = appConfig;
  }

  public get config() {
    return this._config;
  }
}
