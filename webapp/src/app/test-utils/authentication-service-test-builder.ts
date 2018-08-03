import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '@ngx-config/core';
import { Store } from '@ngrx/store';
import { AppState } from '../appState';
import { of } from 'rxjs';

export class AuthenticationServiceTestBuilder {

  private clientSpy = jasmine.createSpyObj('AuthenticationService', ['loginUser', 'logoutUser', 'isLoggedIn', 'getLoggedInUsername']);

  canLogin(value: boolean) {
    this.clientSpy.loginUser.and.callFake(() => of(value));
    return this;
  }

  isLoggedIn(value: boolean) {
    this.clientSpy.isLoggedIn.and.returnValue(true);
    return this;
  }

  username(name: string) {
    this.clientSpy.getLoggedInUsername.and.callFake(() => name);
    return this;
  }

  build() {
    return this.clientSpy;
  }

}
